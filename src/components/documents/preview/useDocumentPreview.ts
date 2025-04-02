
import { useState, useEffect, useCallback } from 'react';
import { DocumentFile } from '@/types/documents';
import { documentPreviewLog } from '@/utils/debug';

export const useDocumentPreview = (document: DocumentFile | null, isOpen: boolean) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [isLoading, setIsLoading] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [useOfficeViewer, setUseOfficeViewer] = useState(false);

  // Reset state when document changes
  useEffect(() => {
    if (document && isOpen) {
      setIsLoading(true);
      setPreviewError(null);
      
      // Determine if we should use Office Viewer
      const shouldUseOfficeViewer = 
        document.name.match(/\.(doc|docx|ppt|pptx|xls|xlsx)$/i) !== null ||
        (document.fileType || '').toLowerCase().includes('office') ||
        (document.fileType || '').toLowerCase().includes('word') ||
        (document.fileType || '').toLowerCase().includes('excel') ||
        (document.fileType || '').toLowerCase().includes('powerpoint');
      
      setUseOfficeViewer(shouldUseOfficeViewer);
      
      documentPreviewLog('Document preview initialized', {
        documentId: document.id,
        documentName: document.name,
        documentUrl: document.url,
        useOfficeViewer: shouldUseOfficeViewer
      });
      
      // Use original document URL by default, 
      // but this could be replaced with a generated preview URL if needed
      setPreviewUrl(document.url);
    } else {
      setActiveTab('preview');
    }
  }, [document, isOpen]);

  const handleLoadSuccess = useCallback(() => {
    documentPreviewLog('Document preview loaded successfully', {
      documentId: document?.id,
      documentUrl: document?.url
    });
    
    setIsLoading(false);
    setPreviewError(null);
  }, [document]);

  const handleLoadError = useCallback(() => {
    const errorMessage = `Failed to load document preview for ${document?.name}`;
    documentPreviewLog(errorMessage, {
      documentId: document?.id,
      documentUrl: document?.url
    });
    
    setIsLoading(false);
    setPreviewError(errorMessage);
  }, [document]);

  const handleDownload = useCallback(() => {
    if (!document?.url) {
      setPreviewError('Document URL is not available for download');
      return;
    }
    
    documentPreviewLog('Downloading document', {
      documentId: document?.id,
      documentUrl: document?.url
    });
    
    try {
      const link = document.createElement('a');
      link.href = document.url;
      link.download = document.name;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading document:', error);
      setPreviewError('Failed to download document');
    }
  }, [document]);

  return {
    activeTab,
    setActiveTab,
    isLoading,
    previewError,
    previewUrl,
    useOfficeViewer,
    handleLoadSuccess,
    handleLoadError,
    handleDownload
  };
};
