
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Upload, FolderOpen } from 'lucide-react';
import DocumentUploadDialog from './DocumentUploadDialog';

interface NoDocumentsPlaceholderProps {
  title?: string;
  description?: string;
  onUpload?: () => void;
  associationId?: string;
  categoryId?: string;
}

const NoDocumentsPlaceholder: React.FC<NoDocumentsPlaceholderProps> = ({
  title = "No documents found",
  description = "Upload a document to get started",
  onUpload,
  associationId,
  categoryId,
}) => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleUploadSuccess = () => {
    if (onUpload) {
      onUpload();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <FolderOpen className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground mt-1 max-w-md">
        {description}
      </p>
      <Button 
        className="mt-4"
        onClick={() => setIsUploadDialogOpen(true)}
      >
        <Upload className="h-4 w-4 mr-2" />
        Upload Document
      </Button>

      <DocumentUploadDialog
        open={isUploadDialogOpen}
        setOpen={setIsUploadDialogOpen}
        onSuccess={handleUploadSuccess}
        associationId={associationId}
        categoryId={categoryId}
      />
    </div>
  );
};

export default NoDocumentsPlaceholder;
