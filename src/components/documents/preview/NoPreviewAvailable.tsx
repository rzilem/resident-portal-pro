
import React from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FileIcon from './FileIcon';

interface NoPreviewAvailableProps {
  fileType: string;
  documentName: string;
  documentUrl: string | null;
  previewUrl: string | null;
  onDownload: () => void;
}

const NoPreviewAvailable: React.FC<NoPreviewAvailableProps> = ({
  fileType,
  documentName,
  documentUrl,
  previewUrl,
  onDownload,
}) => {
  const sanitizeDocumentUrl = (url: string): string => {
    if (!url) return '';
    try {
      url = url.replace(/ /g, '%20');
      const decoded = decodeURIComponent(url);
      if (decoded !== url) {
        return url;
      }
      new URL(url);
      return url;
    } catch (error) {
      console.error('Invalid URL:', url, error);
      return '';
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-8 text-center">
      <div>
        <FileIcon fileType={fileType} />
        <h3 className="text-lg font-medium mb-2">Preview not available</h3>
        <p className="text-muted-foreground mb-4">
          This file type ({fileType}) cannot be previewed in the browser.
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          {documentUrl && (
            <Button 
              variant="outline" 
              onClick={() => window.open(previewUrl || sanitizeDocumentUrl(documentUrl), '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoPreviewAvailable;
