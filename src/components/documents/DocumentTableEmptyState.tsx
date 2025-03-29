
import React from 'react';
import { FolderOpen } from 'lucide-react';

export interface DocumentTableEmptyStateProps {
  searchQuery?: string;
  category?: string;
}

const DocumentTableEmptyState: React.FC<DocumentTableEmptyStateProps> = ({
  searchQuery = '',
  category = ''
}) => {
  let message = 'No documents found';
  
  if (searchQuery && category) {
    message = `No documents found matching "${searchQuery}" in the ${category} category`;
  } else if (searchQuery) {
    message = `No documents found matching "${searchQuery}"`;
  } else if (category) {
    message = `No documents found in the ${category} category`;
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-1">{message}</h3>
      <p className="text-muted-foreground text-center max-w-md">
        Try adjusting your search or filter criteria, or upload a new document.
      </p>
    </div>
  );
};

export default DocumentTableEmptyState;
