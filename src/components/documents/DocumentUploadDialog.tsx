
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { InfoIcon } from 'lucide-react';
import FileUploader from './FileUploader';
import DocumentMetadataForm from './DocumentMetadataForm';
import { toast } from 'sonner';

export interface DocumentUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  refreshDocuments?: () => void; // Add this to make the interface compatible with both usage patterns
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  refreshDocuments 
}) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFilesSelected = (files: File[]) => {
    setUploadedFiles(files);
    if (files.length > 0) {
      setActiveTab('metadata');
    }
  };

  const handleUploadComplete = () => {
    toast.success("Documents uploaded successfully!");
    setUploadedFiles([]);
    setActiveTab('upload');
    onSuccess();
    
    // Call refreshDocuments if it exists (for backward compatibility)
    if (refreshDocuments) {
      refreshDocuments();
    }
    
    onClose();
  };

  const handleCancel = () => {
    if (isUploading) {
      // Ask for confirmation if upload is in progress
      if (window.confirm("Upload in progress. Are you sure you want to cancel?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogDescription>
            Add documents to be stored in your association's repository.
          </DialogDescription>
        </DialogHeader>

        <Alert className="my-4 bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-500" />
          <AlertDescription>
            Documents uploaded here will be available to all authorized users of your association.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="upload" disabled={isUploading}>
              1. Select Files
            </TabsTrigger>
            <TabsTrigger 
              value="metadata" 
              disabled={uploadedFiles.length === 0 || isUploading}
            >
              2. Add Metadata
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <FileUploader
              onFilesSelected={handleFilesSelected}
              acceptedFileTypes={{
                'application/pdf': ['.pdf'],
                'application/msword': ['.doc'],
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                'application/vnd.ms-excel': ['.xls'],
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                'image/jpeg': ['.jpg', '.jpeg'],
                'image/png': ['.png'],
                'text/plain': ['.txt']
              }}
              maxFiles={5}
              maxSize={5 * 1024 * 1024} // 5MB
            />

            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                onClick={() => setActiveTab('metadata')} 
                disabled={uploadedFiles.length === 0}
              >
                Next: Add Metadata
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-4">
            <DocumentMetadataForm
              files={uploadedFiles}
              onUploadComplete={handleUploadComplete}
              onCancel={() => setActiveTab('upload')}
              setIsUploading={setIsUploading}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
