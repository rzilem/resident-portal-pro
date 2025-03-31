
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Download, ExternalLink, RefreshCw } from 'lucide-react';

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
  onDownload
}) => {
  const url = previewUrl || documentUrl;
  
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
      
      <h3 className="text-xl font-medium mb-2">Preview Error</h3>
      
      <p className="text-muted-foreground mb-2 max-w-md">
        {errorMessage || "There was an error loading the document preview."}
      </p>
      
      <p className="text-sm text-muted-foreground/70 mb-6 max-w-md">
        Document: {documentName}
      </p>
      
      <div className="flex flex-wrap gap-3 justify-center">
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
        
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reload
        </Button>
      </div>
    </div>
  );
};

export default PreviewError;
