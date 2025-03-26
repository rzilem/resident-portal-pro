
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, RefreshCw, AlertTriangle, Info } from 'lucide-react';
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
  const { bucketReady, isLoading, isCreating, retryCheck, checkStorageStatus } = useDocumentsBucket();

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
      // Check storage status when dialog opens
      checkStorageStatus();
    }
  }, [isOpen, checkStorageStatus]);

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
      toast.error('Document storage is not available. Please initialize it first.');
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
    console.log('Retrying bucket creation...');
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
              <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
              <div className="text-red-500 mb-2">Document storage is not available</div>
              <p className="text-sm text-muted-foreground mb-4">
                There was a problem connecting to document storage. This might be due to permissions or configuration issues.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 text-left">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-amber-800">
                    Technical note: The system is encountering permission errors when trying to create or access the document storage. 
                    This may require administrator attention.
                  </p>
                </div>
              </div>
              <Button 
                variant="default" 
                onClick={handleRetryBucketCreation}
                className="gap-2"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Initializing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    <span>Initialize Storage</span>
                  </>
                )}
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
