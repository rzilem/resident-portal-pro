
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Download } from 'lucide-react';

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
      <div>
        <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Preview Error</h3>
        <p className="text-muted-foreground mb-2">
          We couldn't generate a preview for this document.
        </p>
        <p className="text-sm text-red-500 mb-6">
          {errorMessage}
        </p>
        <div className="text-xs text-muted-foreground mb-4">
          <p>Document: {documentName}</p>
          {documentUrl && <p>URL: {documentUrl.substring(0, 50)}...</p>}
          {previewUrl && <p>Preview URL: {previewUrl.substring(0, 50)}...</p>}
        </div>
        <Button onClick={onDownload} className="gap-2">
          <Download className="h-4 w-4" />
          Download Instead
        </Button>
      </div>
    </div>
  );
};

export default PreviewError;
