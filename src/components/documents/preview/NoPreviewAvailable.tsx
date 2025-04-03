
import React from 'react';
import { File, Download } from 'lucide-react';
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
        <FileIcon fileType={fileType} className="h-16 w-16 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Preview Available</h3>
        <p className="text-muted-foreground mb-4">
          We can't display a preview for this file type.
        </p>
        
        {documentUrl && (
          <Button onClick={onDownload} className="mx-auto">
            <Download className="h-4 w-4 mr-2" />
            Download File
          </Button>
        )}
        
        <div className="mt-6 text-xs text-muted-foreground">
          <p>File type: {fileType || 'Unknown'}</p>
          <p>File name: {documentName}</p>
        </div>
      </div>
    </div>
  );
};

export default NoPreviewAvailable;
