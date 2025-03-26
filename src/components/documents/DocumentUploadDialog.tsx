
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileUp, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAssociations } from '@/hooks/use-associations';
import { v4 as uuidv4 } from 'uuid';

interface DocumentUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  refreshDocuments?: () => void;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  refreshDocuments
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { activeAssociation } = useAssociations();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!activeAssociation) {
      toast.error('Please select an association first');
      return;
    }

    setIsUploading(true);
    
    try {
      const fileExtension = selectedFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = `${activeAssociation.id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload document: ${error.message}`);
        return;
      }

      console.log('Document uploaded successfully:', data);
      
      // Here you would typically also save document metadata to your documents table
      // This is a placeholder - you'll need to implement the actual document record creation
      const documentRecord = {
        name: selectedFile.name,
        fileSize: selectedFile.size,
        url: data.path,
        uploadedBy: 'current_user', // Replace with actual user ID
        associationId: activeAssociation.id,
        category: 'uncategorized'  // Default category
      };

      toast.success(`Document "${selectedFile.name}" uploaded successfully`);
      onSuccess();
      if (refreshDocuments) refreshDocuments();
      onClose();
    } catch (error) {
      console.error('Unexpected upload error:', error);
      toast.error('An unexpected error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document to share with your association
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center">
            <FileUp className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              {selectedFile ? selectedFile.name : 'Drag and drop a file here, or click to browse'}
            </p>
            {selectedFile && (
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
            {isUploading ? (
              <>
                <span className="mr-2">Uploading...</span>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
