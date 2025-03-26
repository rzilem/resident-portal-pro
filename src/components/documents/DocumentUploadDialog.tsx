
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useAssociations } from '@/hooks/use-associations';
import FileUploader from './FileUploader';
import DocumentMetadataForm from './DocumentMetadataForm';
import { useDocumentsBucket } from '@/hooks/use-documents-bucket';
import { uploadDocument } from '@/services/document-upload';

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
  // Form state
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('uncategorized');
  const [tags, setTags] = useState<string[]>([]);
  
  // Hooks
  const { activeAssociation } = useAssociations();
  const { bucketReady, isLoading, retryCheck } = useDocumentsBucket();

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    // Validation checks
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!activeAssociation) {
      toast.error('Please select an association first');
      return;
    }

    if (!bucketReady) {
      toast.error('Document storage is not available. Please try again later.');
      return;
    }

    setIsUploading(true);
    console.log('Starting upload with association ID:', activeAssociation.id);
    
    try {
      const success = await uploadDocument({
        file: selectedFile,
        description,
        category,
        tags,
        associationId: activeAssociation.id
      });
      
      if (success) {
        onSuccess();
        if (refreshDocuments) refreshDocuments();
        resetForm();
        onClose();
      } else {
        console.error('Upload returned false');
      }
    } catch (error) {
      console.error('Upload error caught in component:', error);
      toast.error('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const resetForm = () => {
    setSelectedFile(null);
    setDescription('');
    setCategory('uncategorized');
    setTags([]);
  };
  
  const handleRetryBucketCreation = () => {
    retryCheck();
  };

  const isButtonDisabled = !selectedFile || isUploading || isLoading || !bucketReady;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document to share with your association
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-6">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <span className="ml-3">Preparing document storage...</span>
            </div>
          ) : !bucketReady ? (
            <div className="text-center p-6">
              <div className="text-red-500 mb-2">Document storage is not available</div>
              <p className="text-sm text-muted-foreground mb-4">
                There was a problem connecting to document storage. Please try again later or contact support.
              </p>
              <Button 
                variant="outline" 
                onClick={handleRetryBucketCreation}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry Connection
              </Button>
            </div>
          ) : (
            <>
              <FileUploader 
                onFileSelected={handleFileChange}
                currentFile={selectedFile}
              />
              
              {selectedFile && (
                <DocumentMetadataForm
                  description={description}
                  setDescription={setDescription}
                  category={category}
                  setCategory={setCategory}
                  tags={tags}
                  setTags={setTags}
                />
              )}
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={isButtonDisabled}
            className="relative"
          >
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
