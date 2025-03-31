
import React from 'react';
import { AlertTriangle, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PreviewErrorProps {
  errorMessage: string;
  documentName: string;
  documentUrl: string | null;
  previewUrl: string | null;
  onDownload: () => void;
}

const PreviewError: React.FC<PreviewErrorProps> = ({
  errorMessage,
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

  return (
    <div className="w-full h-full flex items-center justify-center p-8 text-center">
      <div>
        <AlertTriangle className="h-16 w-16 mx-auto text-destructive mb-4" />
        <h3 className="text-lg font-medium mb-2">Preview Error</h3>
        <p className="text-muted-foreground mb-4">{errorMessage}</p>
        <div className="flex gap-2 justify-center">
          <Button onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download Instead
          </Button>
          {documentUrl && (
            <Button 
              variant="outline" 
              onClick={handleOpenInNewTab}
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

export default PreviewError;
