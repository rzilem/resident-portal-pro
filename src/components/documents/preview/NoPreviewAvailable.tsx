
import React from 'react';
import { Download } from 'lucide-react';
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
  onDownload
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-8 text-center">
      <div>
        <div className="flex justify-center mb-4">
          <FileIcon fileType={fileType} size={48} />
        </div>
        
        <h3 className="text-lg font-medium mb-2">Preview Not Available</h3>
        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
          This file type cannot be previewed directly in the browser.
        </p>
        
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          You can download the file to view it with the appropriate application.
        </p>
        
        <Button 
          variant="default" 
          onClick={onDownload}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download {documentName}
        </Button>
      </div>
    </div>
  );
};

export default NoPreviewAvailable;
