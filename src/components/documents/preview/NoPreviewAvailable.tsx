
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileQuestion } from 'lucide-react';
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
        <FileIcon fileType={fileType} className="h-16 w-16 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Preview Available</h3>
        <p className="text-muted-foreground mb-6">
          This file type cannot be previewed directly in the browser.
          <br />
          Please download the file to view its contents.
        </p>
        <Button onClick={onDownload} className="gap-2">
          <Download className="h-4 w-4" />
          Download File
        </Button>
      </div>
    </div>
  );
};

export default NoPreviewAvailable;
