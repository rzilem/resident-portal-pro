
import React, { useState, useEffect } from 'react';
import { DocumentFile } from '@/types/documents';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { isPreviewableDocument, useGoogleDocsViewer } from '@/utils/documents';
import { X, Download, ExternalLink } from 'lucide-react';
import NoPreviewAvailable from './NoPreviewAvailable';
import PDFPreview from './PDFPreview';
import ImagePreview from './ImagePreview';
import TextPreview from './TextPreview';
import { toast } from 'sonner';

interface DocumentPreviewProps {
  document: DocumentFile | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (document: DocumentFile) => Promise<boolean>;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  isOpen,
  onClose,
  onDownload
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (document && isOpen) {
      setLoading(true);
      setError(null);
      
      try {
        // Check if we can preview this document type
        if (isPreviewableDocument(document.fileType)) {
          if (useGoogleDocsViewer(document.fileType) && !document.fileType.startsWith('image/')) {
            // Use Google Docs Viewer for supported document types
            const encodedUrl = encodeURIComponent(document.url);
            setPreviewUrl(`https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`);
          } else {
            // Direct URL for images and other previewable types
            setPreviewUrl(document.url);
          }
        } else {
          // Not previewable
          setPreviewUrl(null);
        }
      } catch (err) {
        console.error("Error generating preview URL:", err);
        setError("Failed to generate preview");
        setPreviewUrl(null);
      } finally {
        setLoading(false);
      }
    } else {
      setPreviewUrl(null);
    }
  }, [document, isOpen]);

  const handleDownload = async () => {
    if (!document) return;
    
    if (onDownload) {
      try {
        const success = await onDownload(document);
        if (!success) {
          toast.error("Failed to download document");
        }
      } catch (err) {
        console.error("Error downloading document:", err);
        toast.error("Failed to download document");
      }
    } else {
      // Fallback download mechanism if no onDownload function provided
      try {
        const link = document.createElement('a');
        link.href = document.url;
        link.download = document.name;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error("Error downloading document:", err);
        toast.error("Failed to download document");
      }
    }
  };

  const renderPreview = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading preview...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-10">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12" y2="16"></line>
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Preview Error</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      );
    }

    if (!document) {
      return null;
    }

    if (!previewUrl) {
      return (
        <NoPreviewAvailable
          fileType={document.fileType}
          documentName={document.name}
          documentUrl={document.url}
          previewUrl={previewUrl}
          onDownload={handleDownload}
        />
      );
    }

    // Select the appropriate preview component based on file type
    if (document.fileType.startsWith('image/')) {
      return <ImagePreview src={previewUrl} alt={document.name} />;
    } else if (document.fileType === 'application/pdf') {
      return <PDFPreview src={previewUrl} />;
    } else if (document.fileType.startsWith('text/')) {
      return <TextPreview src={previewUrl} />;
    } else if (useGoogleDocsViewer(document.fileType)) {
      return (
        <iframe
          src={previewUrl}
          className="w-full h-full min-h-[500px] border-0"
          title={document.name}
        ></iframe>
      );
    }

    // Fallback for other file types
    return (
      <NoPreviewAvailable
        fileType={document.fileType}
        documentName={document.name}
        documentUrl={document.url}
        previewUrl={previewUrl}
        onDownload={handleDownload}
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="truncate flex-1 mr-2">
              {document?.name || 'Document Preview'}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={!document}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => window.open(document?.url, '_blank')}
                disabled={!document}
                className="flex items-center gap-1"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">Open</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {document?.description && (
            <DialogDescription>
              {document.description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          {renderPreview()}
        </div>
        
        <DialogFooter className="mt-2">
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-muted-foreground">
            <div>
              {document?.uploadedDate && (
                <span>Uploaded: {new Date(document.uploadedDate).toLocaleDateString()}</span>
              )}
              {document?.uploadedBy && (
                <span className="ml-3">By: {document.uploadedBy}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {document?.fileType && (
                <span>Type: {document.fileType.split('/')[1]?.toUpperCase() || document.fileType}</span>
              )}
              {document?.version && (
                <span className="ml-3">Version: {document.version}</span>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
