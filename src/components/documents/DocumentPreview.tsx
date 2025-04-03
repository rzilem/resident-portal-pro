
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, X } from 'lucide-react';
import { DocumentFile } from '@/types/documents';
import { formatFileSize, formatDate } from '@/utils/formatting';
import { Badge } from '@/components/ui/badge';

interface DocumentPreviewProps {
  document: DocumentFile;
  onClose: () => void;
  onDownload?: (document: DocumentFile) => Promise<boolean>;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  onClose,
  onDownload
}) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if file is an image
  const isImage = document.fileType.startsWith('image/');
  
  // Check if file is a PDF
  const isPdf = document.fileType === 'application/pdf';
  
  // Handle download
  const handleDownload = async () => {
    if (onDownload) {
      await onDownload(document);
    } else {
      // Fallback direct download
      window.open(document.url, '_blank');
    }
  };
  
  return (
    <Dialog open={!!document} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="text-xl">{document.name}</DialogTitle>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <Badge variant="outline">
                {document.category || 'General'}
              </Badge>
              <span>{formatFileSize(document.fileSize)}</span>
              <span>Uploaded: {formatDate(document.uploadedDate)}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden bg-muted rounded-md">
          {isImage ? (
            <img
              src={document.url}
              alt={document.name}
              className="w-full h-full object-contain"
              onLoad={() => setIsLoading(false)}
            />
          ) : isPdf ? (
            <iframe
              src={`${document.url}#toolbar=0`}
              className="w-full h-full"
              onLoad={() => setIsLoading(false)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-5xl mb-4">📄</div>
              <p className="mb-2">Preview not available for this file type</p>
              <Button onClick={handleDownload} className="mt-4">
                <Download className="h-4 w-4 mr-2" />
                Download to view
              </Button>
            </div>
          )}
          
          {isLoading && (isImage || isPdf) && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          {document.description && (
            <p className="text-sm text-muted-foreground">
              {document.description}
            </p>
          )}
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => window.open(document.url, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
