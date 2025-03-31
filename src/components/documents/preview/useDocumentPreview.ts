
import { useState, useEffect } from 'react';
import { DocumentFile } from '@/types/documents';
import { canUseOfficeViewer, sanitizeDocumentUrl } from '@/utils/documents/documentUtils';
import { documentPreviewLog, errorLog } from '@/utils/debug';
import { toast } from 'sonner';

export const useDocumentPreview = (document: DocumentFile | null, isOpen: boolean) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [isLoading, setIsLoading] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [useOfficeViewer, setUseOfficeViewer] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  useEffect(() => {
    documentPreviewLog('isOpen or document changed', { 
      isOpen, 
      documentName: document?.name, 
      documentId: document?.id 
    });
  }, [isOpen, document]);
  
  useEffect(() => {
    documentPreviewLog('Dialog open state', { isOpen });
    
    if (document && isOpen) {
      setIsLoading(true);
      setPreviewError(null);
      
      documentPreviewLog('Processing document', {
        name: document.name,
        id: document.id,
        fileType: document.fileType,
        url: document.url
      });
      
      const shouldUseOfficeViewer = document.fileType && canUseOfficeViewer(document.fileType);
      setUseOfficeViewer(shouldUseOfficeViewer);
      documentPreviewLog('Office viewer decision', { useOfficeViewer: shouldUseOfficeViewer });
      
      updatePreviewUrl(document);
    }
  }, [document, isOpen]);
  
  const updatePreviewUrl = async (doc: DocumentFile) => {
    if (!doc.url) {
      setPreviewError("Document URL is not available");
      setIsLoading(false);
      errorLog("Document URL is not available", { docId: doc.id, docName: doc.name });
      return;
    }
    
    documentPreviewLog('Processing URL', { originalUrl: doc.url });
    
    try {
      const cleanUrl = sanitizeDocumentUrl(doc.url);
      documentPreviewLog('Using sanitized URL', { cleanUrl });
      // Fixed here - removed the third argument that was causing the error
      setPreviewUrl(cleanUrl);
      setIsLoading(false);
    } catch (error) {
      errorLog('Error processing document URL:', error);
      setPreviewError("Failed to process document URL");
      // Fallback to original URL
      setPreviewUrl(sanitizeDocumentUrl(doc.url));
      setIsLoading(false);
    }
  };
  
  const handleLoadError = () => {
    setIsLoading(false);
    setPreviewError("Failed to load document preview");
    errorLog("Failed to load document preview for:", document?.name, document?.url);
  };
  
  const handleLoadSuccess = () => {
    setIsLoading(false);
    setPreviewError(null);
    documentPreviewLog('Preview loaded successfully');
  };
  
  const handleDownload = () => {
    if (!document || !document.url) {
      toast.error("Document URL is not available");
      return;
    }
    
    const link = window.document.createElement('a');
    link.href = previewUrl || sanitizeDocumentUrl(document.url);
    link.download = document.name;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    
    toast.success(`Downloading ${document.name}`);
  };
  
  return {
    activeTab,
    setActiveTab,
    isLoading,
    previewError,
    useOfficeViewer,
    previewUrl,
    handleLoadError,
    handleLoadSuccess,
    handleDownload
  };
};
