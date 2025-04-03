
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileUploader } from '@/components/ui/file-uploader';
import { Save, X, Upload, Loader2 } from 'lucide-react';
import { useDocumentsBucket } from '@/hooks/use-documents-bucket';
import { uploadDocument } from '@/services/documentService';
import { DocumentFile } from '@/types/documents';

export interface DocumentUploaderProps {
  associationId: string;
  onUploadComplete: (document: DocumentFile) => void;
  category?: string;
  onCancel?: () => void; // Optional cancel handler
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  associationId,
  onUploadComplete,
  category = 'general',
  onCancel
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { bucketReady } = useDocumentsBucket();
  
  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    
    try {
      const uploadedDocument = await uploadDocument({
        file,
        associationId,
        description,
        category,
      });
      
      toast.success('Document uploaded successfully');
      onUploadComplete(uploadedDocument);
      
      // Reset form
      setFile(null);
      setDescription('');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFile(null);
    setDescription('');
    // Call onCancel if provided
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Upload Document</h3>
        {onCancel && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCancel}
            disabled={isUploading}
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        )}
      </div>
      
      <FileUploader
        file={file}
        setFile={setFile}
        disabled={isUploading || !bucketReady}
        acceptedTypes="*/*"
      />
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description (optional)
        </label>
        <textarea
          id="description"
          className="w-full min-h-[100px] p-2 border rounded-md resize-none"
          placeholder="Enter a description for this document..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isUploading}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isUploading}
          >
            Cancel
          </Button>
        )}
        
        <Button 
          onClick={handleUpload} 
          disabled={!file || isUploading || !bucketReady}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DocumentUploader;
