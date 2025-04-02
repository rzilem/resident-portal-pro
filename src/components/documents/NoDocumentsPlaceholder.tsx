
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Upload, FolderOpen } from 'lucide-react';
import DocumentUploadDialog from './DocumentUploadDialog';

interface NoDocumentsPlaceholderProps {
  title?: string;
  description?: string;
  onUpload?: () => void;
  associationId?: string;
  category?: string;
  searchQuery?: string;
  filter?: 'recent' | 'shared' | 'important';
}

const NoDocumentsPlaceholder: React.FC<NoDocumentsPlaceholderProps> = ({
  title,
  description,
  onUpload,
  associationId,
  category,
  searchQuery,
  filter,
}) => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleUploadSuccess = () => {
    if (onUpload) {
      onUpload();
    }
  };

  // Generate appropriate title and description based on props
  const getTitle = () => {
    if (title) return title;
    if (searchQuery) return "No search results";
    if (filter === 'recent') return "No recent documents";
    if (filter === 'shared') return "No shared documents";
    if (filter === 'important') return "No important documents";
    return "No documents found";
  };

  const getDescription = () => {
    if (description) return description;
    if (searchQuery) return `No documents match "${searchQuery}"`;
    if (filter) return `No ${filter} documents found in this category`;
    if (category) return `No documents found in ${category}`;
    return "Upload a document to get started";
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        {searchQuery ? (
          <Search className="h-10 w-10 text-muted-foreground" />
        ) : (
          <FolderOpen className="h-10 w-10 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-lg font-medium">{getTitle()}</h3>
      <p className="text-muted-foreground mt-1 max-w-md">
        {getDescription()}
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
        category={category}
      />
    </div>
  );
};

export default NoDocumentsPlaceholder;
