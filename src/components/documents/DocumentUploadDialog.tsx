
import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, RefreshCw, AlertTriangle, Info, Loader2, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { useAssociations } from '@/hooks/use-associations';
import FileUploader from './FileUploader';
import DocumentMetadataForm from './DocumentMetadataForm';
import { useDocumentsBucket } from '@/hooks/use-documents-bucket';
import { uploadDocument } from '@/services/document-upload';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

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
  const [initializing, setInitializing] = useState(true);
  const [initializationTimeout, setInitializationTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Hooks
  const { activeAssociation } = useAssociations();
  const { bucketReady, isLoading, isCreating, errorMessage, retryCheck, checkStorageStatus } = useDocumentsBucket();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Reset form when dialog opens and check storage status
  useEffect(() => {
    if (isOpen) {
      resetForm();
      setInitializing(true);
      
      // Clear any existing timeout
      if (initializationTimeout) {
        clearTimeout(initializationTimeout);
      }
      
      console.log('Checking storage status on dialog open');
      checkStorageStatus();
      
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.log('Initialization timeout reached, exiting loading state');
        setInitializing(false);
      }, 8000); // Reduced from 10s to 8s
      
      setInitializationTimeout(timeoutId);
      
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }
  }, [isOpen, checkStorageStatus]);
  
  // Update initializing state when loading completes
  useEffect(() => {
    if (!isLoading && initializing) {
      console.log('Storage loading complete, setting initializing to false');
      setInitializing(false);
      
      // Clear the timeout since loading completed naturally
      if (initializationTimeout) {
        clearTimeout(initializationTimeout);
        setInitializationTimeout(null);
      }
    }
  }, [isLoading, initializing, initializationTimeout]);

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
    
    if (!isAuthenticated) {
      toast.error('You must be signed in to upload documents');
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
        toast.success(`Document "${selectedFile.name}" uploaded successfully`);
        onSuccess();
        if (refreshDocuments) refreshDocuments();
        resetForm();
        onClose();
      } else {
        console.error('Upload returned false');
        toast.error('Upload failed. Please try again.');
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
    setInitializing(true); // Reset initializing to show loading again
    console.log('Retrying bucket creation...');
    retryCheck();
    
    // Set a timeout to exit initializing state if it gets stuck
    const timeoutId = setTimeout(() => {
      setInitializing(false);
    }, 8000);
    
    setInitializationTimeout(timeoutId);
  };

  const handleSignIn = () => {
    onClose(); // Close the dialog
    navigate('/auth'); // Navigate to the auth page
  };

  const isButtonDisabled = !selectedFile || isUploading || isLoading || !bucketReady || !isAuthenticated;

  // Determine what state to display
  const isLoadingState = isLoading || initializing;

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
          {!isAuthenticated && (
            <div className="text-center p-6">
              <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
              <div className="text-red-500 mb-2">Authentication Required</div>
              <p className="text-sm text-muted-foreground mb-4">
                You must be signed in to upload documents. Please sign in and try again.
              </p>
              <Button onClick={handleSignIn} className="gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </div>
          )}
          {isAuthenticated && isLoadingState && (
            <div className="flex flex-col items-center justify-center p-6">
              <div className="relative">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
              </div>
              <span className="text-lg font-medium">Preparing document storage...</span>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {initializing && isLoading ? 
                  "This may take a moment. If it takes too long, you can try refreshing the page." :
                  "Almost ready! Checking storage accessibility..."}
              </p>
            </div>
          )}
          {isAuthenticated && !isLoadingState && !bucketReady && (
            <div className="text-center p-6">
              <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
              <div className="text-red-500 mb-2">Document storage is not available</div>
              <p className="text-sm text-muted-foreground mb-4">
                {errorMessage || 'There was a problem connecting to document storage. This might be due to permissions or configuration issues.'}
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 text-left">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-amber-800">
                    The system is having trouble accessing the document storage in Supabase. 
                    This is usually because of permission issues. Make sure you're logged in, 
                    or try clicking the button below to initialize storage.
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
                    <Loader2 className="h-4 w-4 animate-spin" />
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
          )}
          {isAuthenticated && !isLoadingState && bucketReady && (
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
                <Loader2 className="h-4 w-4 animate-spin" />
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
