
import React from 'react';
import { AlertTriangle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FileIcon from './FileIcon';

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
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3 mb-2">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <div className="flex justify-center mb-4">
          <FileIcon fileType={documentName.split('.').pop() || ''} />
        </div>
        
        <h3 className="text-lg font-medium mb-2">Preview Not Available</h3>
        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
          {errorMessage}
        </p>
        
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          The document may be in an unsupported format or requires specific software to view.
        </p>
        
        <Button 
          variant="outline" 
          onClick={onDownload}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Document
        </Button>
      </div>
    </div>
  );
};

export default PreviewError;
