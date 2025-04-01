
import React, { useState } from 'react';
import { FileUploader } from '@/components/ui/file-uploader';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Paperclip, X } from 'lucide-react';
import { LeadDocument } from './types';

interface LeadDocumentUploadProps {
  leadId?: string;
  documents: LeadDocument[];
  onDocumentsChange: (documents: LeadDocument[]) => void;
  maxFiles?: number;
}

const LeadDocumentUpload: React.FC<LeadDocumentUploadProps> = ({ 
  leadId,
  documents = [],
  onDocumentsChange,
  maxFiles = 5
}) => {
  const [uploading, setUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const handleFileUpload = async () => {
    if (!currentFile) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setUploading(true);

      // Create a unique file name
      const fileExt = currentFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = leadId 
        ? `leads/${leadId}/${fileName}`
        : `leads/temp/${fileName}`;

      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, currentFile);

      if (error) throw error;

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      const newDocument: LeadDocument = {
        name: currentFile.name,
        size: currentFile.size,
        type: currentFile.type,
        path: filePath,
        url: urlData.publicUrl,
        uploadedAt: new Date().toISOString()
      };

      // Add the new document to the documents array
      const updatedDocuments = [...documents, newDocument];
      onDocumentsChange(updatedDocuments);
      
      // Clear the current file
      setCurrentFile(null);
      toast.success("Document uploaded successfully");
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveDocument = (index: number) => {
    const documentToRemove = documents[index];
    const updatedDocuments = documents.filter((_, i) => i !== index);
    
    // If there's a real file path, delete it from storage
    if (documentToRemove.path) {
      supabase.storage
        .from('documents')
        .remove([documentToRemove.path])
        .then(({ error }) => {
          if (error) {
            console.error("Error removing file:", error);
          }
        });
    }
    
    onDocumentsChange(updatedDocuments);
    toast.success("Document removed");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        {documents.length > 0 && (
          <div className="border rounded-md p-3">
            <h4 className="text-sm font-medium mb-2">Attached Documents</h4>
            <div className="space-y-2">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded text-sm">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Paperclip className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{doc.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({Math.round(doc.size / 1024)} KB)
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveDocument(index)}
                    className="h-7 w-7 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {documents.length < maxFiles && (
          <div className="space-y-2">
            <FileUploader
              file={currentFile}
              setFile={setCurrentFile}
              maxSize={10 * 1024 * 1024} // 10MB
              acceptedTypes="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip,image/jpeg,image/png,image/gif"
              disabled={uploading}
            />
            
            <Button 
              onClick={handleFileUpload} 
              disabled={!currentFile || uploading} 
              className="w-full"
            >
              {uploading ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadDocumentUpload;
