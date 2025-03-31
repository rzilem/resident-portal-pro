
import React from 'react';
import { FileText, Plus, Search, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDialog } from '@/hooks/use-dialog';
import DocumentUploadDialog from './DocumentUploadDialog';

interface NoDocumentsPlaceholderProps {
  searchQuery?: string;
  category?: string;
  filter?: string;
}

const NoDocumentsPlaceholder: React.FC<NoDocumentsPlaceholderProps> = ({
  searchQuery,
  category,
  filter
}) => {
  const { open, setOpen } = useDialog();

  let icon = <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />;
  let title = 'No documents found';
  let description = 'No documents have been uploaded yet.';
  
  if (searchQuery) {
    icon = <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />;
    title = 'No matching documents';
    description = `No documents match your search "${searchQuery}".`;
  } else if (category) {
    icon = <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />;
    title = 'No documents in this category';
    description = 'This category doesn\'t have any documents yet.';
  } else if (filter === 'recent') {
    title = 'No recent documents';
    description = 'No documents have been uploaded in the last 30 days.';
  } else if (filter === 'shared') {
    title = 'No shared documents';
    description = 'No documents have been shared with you.';
  } else if (filter === 'important') {
    title = 'No important documents';
    description = 'No documents have been marked as important.';
  }

  return (
    <div className="text-center py-10">
      {icon}
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground mt-1 mb-6">
        {description}
      </p>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Upload Document
      </Button>
      
      <DocumentUploadDialog 
        open={open}
        setOpen={setOpen}
        categoryId={category}
      />
    </div>
  );
};

export default NoDocumentsPlaceholder;
