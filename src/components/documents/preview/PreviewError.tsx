
import React from 'react';
import { AlertTriangle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  return (
    <div className="w-full h-full flex items-center justify-center p-8 text-center">
      <div className="max-w-md">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Preview Error</h3>
        <p className="text-muted-foreground mb-2">{errorMessage}</p>
        <p className="text-xs text-muted-foreground mb-4">
          We were unable to generate a preview for "{documentName}"
        </p>
        
        {documentUrl && (
          <div className="flex justify-center">
            <Button onClick={onDownload} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Instead
            </Button>
          </div>
        )}
        
        <div className="mt-4 text-xs text-muted-foreground border-t border-muted pt-4">
          <p>Debug Information:</p>
          <p>Document URL: {documentUrl || 'Not available'}</p>
          <p>Preview URL: {previewUrl || 'Not available'}</p>
        </div>
      </div>
    </div>
  );
};

export default PreviewError;
