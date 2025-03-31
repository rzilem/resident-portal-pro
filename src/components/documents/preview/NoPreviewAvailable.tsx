
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileIcon, Download, ExternalLink } from 'lucide-react';

interface NoPreviewAvailableProps {
  fileType: string;
  documentName: string;
  documentUrl: string | null;
  previewUrl?: string | null;
  onDownload: () => void;
}

const NoPreviewAvailable: React.FC<NoPreviewAvailableProps> = ({
  fileType,
  documentName,
  documentUrl,
  previewUrl,
  onDownload
}) => {
  const url = previewUrl || documentUrl;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
      <FileIcon className="h-16 w-16 text-muted-foreground mb-4" />
      
      <h3 className="text-xl font-medium mb-2">Preview Not Available</h3>
      
      <p className="text-muted-foreground mb-6 max-w-md">
        Preview is not available for this file type ({fileType || 'unknown'}).
        You can download the document to view it.
      </p>
      
      <div className="flex gap-3">
        <Button onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        
        {url && (
          <Button variant="outline" asChild>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};

export default NoPreviewAvailable;
