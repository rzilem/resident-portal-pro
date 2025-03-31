
import React from 'react';
import { Download, ExternalLink, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FileIcon from './FileIcon';
import { toast } from 'sonner';

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

  const handleOpenInNewTab = () => {
    try {
      if (!documentUrl) {
        toast.error("Document URL is not available");
        return;
      }
      const url = previewUrl || sanitizeDocumentUrl(documentUrl);
      window.open(url, '_blank');
    } catch (error) {
      toast.error("Failed to open document in new tab");
    }
  };
  
  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toUpperCase() || '';
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-8 text-center">
      <div className="max-w-md">
        <div className="flex justify-center mb-4">
          <FileIcon fileType={fileType} className="h-16 w-16" />
        </div>
        <h3 className="text-lg font-medium mb-2">Preview not available</h3>
        <p className="text-muted-foreground mb-4">
          {getFileExtension(documentName)} files cannot be previewed directly. 
          You can download the file or open it in a new tab.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onDownload} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download File
          </Button>
          {documentUrl && (
            <Button 
              variant="outline" 
              onClick={handleOpenInNewTab}
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground mt-6">
          For the best experience, consider converting this file to 
          a more widely supported format like PDF.
        </p>
      </div>
    </div>
  );
};

export default NoPreviewAvailable;
