
import React, { useState, useEffect } from 'react';
import { DocumentFile } from '@/types/documents';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, X, Maximize, Minimize, FileText, File } from "lucide-react";
import { formatFileSize, isFilePreviewable, canUseOfficeViewer, getOfficeViewerUrl } from "@/utils/documents/documentUtils";

interface DocumentPreviewProps {
  document: DocumentFile | null;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentPreviewComponent: React.FC<DocumentPreviewProps> = ({ 
  document, 
  isOpen, 
  onClose 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    if (document && document.url) {
      // Check if this is an Office document that we can preview with Office Online
      if (canUseOfficeViewer(document.fileType)) {
        setPreviewUrl(getOfficeViewerUrl(document.url));
      } else {
        setPreviewUrl(document.url);
      }
    }
    
    // Reset states when document changes
    setIsIframeLoaded(false);
    setIframeError(false);
  }, [document]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    if (document && document.url) {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = document.url;
      link.download = document.name;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleIframeLoad = () => {
    setIsIframeLoaded(true);
  };

  const handleIframeError = () => {
    setIframeError(true);
  };

  if (!document) return null;

  const canPreview = isFilePreviewable(document.fileType);
  const isOfficeDoc = canUseOfficeViewer(document.fileType);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`bg-background p-0 ${isFullscreen ? 'w-screen h-screen max-w-full max-h-full rounded-none' : 'sm:max-w-2xl'}`}>
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="truncate">{document.name}</span>
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className={`overflow-auto ${isFullscreen ? 'h-[calc(100vh-9rem)]' : 'max-h-[60vh]'}`}>
          {canPreview || isOfficeDoc ? (
            <div className="relative w-full h-full">
              {!isIframeLoaded && !iframeError && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading preview...</p>
                  </div>
                </div>
              )}
              
              {iframeError && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                  <div className="flex flex-col items-center text-center p-6">
                    <File className="h-12 w-12 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium">Preview Unavailable</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                      This file cannot be previewed in the browser.
                    </p>
                    <Button onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download File
                    </Button>
                  </div>
                </div>
              )}
              
              <iframe 
                src={previewUrl}
                className={`w-full ${isFullscreen ? 'h-[calc(100vh-9rem)]' : 'h-[60vh]'} border-0`}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title={document.name}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <File className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Preview Unavailable</h3>
                <p className="text-muted-foreground mb-6">
                  This file type cannot be previewed in the browser.
                </p>
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="bg-muted/20 p-4 border-t">
          <div className="w-full">
            <div className="flex flex-col space-y-1 mb-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Size:</span>
                <span className="text-sm">{formatFileSize(document.fileSize)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Type:</span>
                <span className="text-sm">{document.fileType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Uploaded:</span>
                <span className="text-sm">{formatDate(document.uploadedDate)}</span>
              </div>
              {document.category && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Category:</span>
                  <span className="text-sm">{document.category}</span>
                </div>
              )}
            </div>
            
            {document.tags && document.tags.length > 0 && (
              <div className="mb-4">
                <span className="text-sm font-medium mb-1">Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {document.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewComponent;
