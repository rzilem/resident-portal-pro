
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { DocumentFile } from '@/types/documents';
import DocumentPreviewComponent from './DocumentPreviewComponent';

interface DocumentPreviewProps {
  document: DocumentFile | null;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  isOpen,
  onClose
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-3xl md:max-w-5xl overflow-y-auto" side="right">
        <SheetHeader className="flex flex-row items-center justify-between mb-4">
          <SheetTitle className="text-left truncate flex-1">
            {document?.name || 'Document Preview'}
          </SheetTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </SheetHeader>
        
        <div className="mt-6">
          <DocumentPreviewComponent document={document} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DocumentPreview;
