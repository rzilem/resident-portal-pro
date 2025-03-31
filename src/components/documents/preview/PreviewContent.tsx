
import React from 'react';
import PreviewError from './PreviewError';
import NoPreviewAvailable from './NoPreviewAvailable';
import FileIcon from './FileIcon';
import { documentPreviewLog } from '@/utils/debug';

interface PreviewContentProps {
  isLoading: boolean;
  previewError: string | null;
  document: {
    name: string;
    url: string | null;
    fileType: string;
  };
  previewUrl: string | null;
  useOfficeViewer: boolean;
  onLoadSuccess: () => void;
  onLoadError: () => void;
  onDownload: () => void;
}

const PreviewContent: React.FC<PreviewContentProps> = ({
  isLoading,
  previewError,
  document,
  previewUrl,
  useOfficeViewer,
  onLoadSuccess,
  onLoadError,
  onDownload,
}) => {
  // Function to safely handle document URLs
  const getPreviewUrl = () => {
    if (!previewUrl && !document.url) return '';
    
    if (useOfficeViewer) {
      return getOfficeViewerUrl(previewUrl || document.url);
    }
    return previewUrl || document.url || '';
  };

  // Function to get Office viewer URL
  const getOfficeViewerUrl = (url: string | null): string => {
    if (!url) return '';
    // Microsoft Office Online Viewer
    return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (previewError) {
    return (
      <PreviewError
        errorMessage={previewError}
        documentName={document.name}
        documentUrl={document.url}
        previewUrl={previewUrl}
        onDownload={onDownload}
      />
    );
  }

  if (!document.url && !previewUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 text-center">
        <div>
          <FileIcon fileType={document.fileType} />
          <h3 className="text-lg font-medium mb-2">No URL Available</h3>
          <p className="text-muted-foreground mb-4">The document URL is not available</p>
        </div>
      </div>
    );
  }
  
  const fileType = document.fileType.toLowerCase();
  const previewUrlToUse = getPreviewUrl();
  
  documentPreviewLog('Final Preview URL being used:', { previewUrl: previewUrlToUse });
  documentPreviewLog('File type being previewed:', { fileType });
  
  if (fileType.includes('pdf')) {
    return (
      <iframe 
        src={previewUrlToUse} 
        className="w-full h-full" 
        title={document.name}
        onLoad={onLoadSuccess}
        onError={onLoadError}
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    );
  } 
  else if (
    fileType.includes('image') || 
    fileType.includes('jpg') || 
    fileType.includes('jpeg') || 
    fileType.includes('png') || 
    fileType.includes('gif') ||
    fileType.includes('svg') ||
    fileType.includes('webp') ||
    document.name.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)
  ) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background/50">
        <img 
          src={previewUrlToUse} 
          alt={document.name} 
          className="max-w-full max-h-full object-contain"
          onLoad={onLoadSuccess}
          onError={onLoadError}
        />
      </div>
    );
  }
  else if (useOfficeViewer) {
    return (
      <iframe 
        src={previewUrlToUse} 
        className="w-full h-full" 
        title={document.name}
        onLoad={onLoadSuccess}
        onError={onLoadError}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    );
  }
  else {
    return (
      <NoPreviewAvailable
        fileType={document.fileType}
        documentName={document.name}
        documentUrl={document.url}
        previewUrl={previewUrl}
        onDownload={onDownload}
      />
    );
  }
};

export default PreviewContent;
