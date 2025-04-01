
import { useState, useEffect } from 'react';
import { DocumentFile } from '@/types/documents';
import { toast } from 'sonner';

interface UseDocumentPreviewResult {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading: boolean;
  previewError: string | null;
  useOfficeViewer: boolean;
  previewUrl: string | null;
  handleLoadError: () => void;
  handleLoadSuccess: () => void;
  handleDownload: () => void;
}

export const useDocumentPreview = (
  document: DocumentFile | null,
  isOpen: boolean
): UseDocumentPreviewResult => {
  const [activeTab, setActiveTab] = useState('preview');
  const [isLoading, setIsLoading] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [useOfficeViewer, setUseOfficeViewer] = useState(false);

  // Reset state when document changes or dialog opens
  useEffect(() => {
    if (isOpen && document) {
      setIsLoading(true);
      setPreviewError(null);
      
      // Determine if we should use Microsoft Office Online Viewer
      const shouldUseOfficeViewer = determineIfUseOfficeViewer(document.fileType);
      setUseOfficeViewer(shouldUseOfficeViewer);
      
      // Set the preview URL (in this case, same as document URL)
      setPreviewUrl(document.url);
      
      // For images, we can mark as loaded immediately
      if (document.fileType.startsWith('image/')) {
        setIsLoading(false);
      }
    }
  }, [document, isOpen]);

  const determineIfUseOfficeViewer = (fileType: string): boolean => {
    const type = fileType.toLowerCase();
    
    return (
      type.includes('word') ||
      type.includes('excel') ||
      type.includes('spreadsheet') ||
      type.includes('powerpoint') ||
      type.includes('presentation') ||
      type.includes('msword') ||
      type.includes('officedocument') ||
      type.match(/\.(docx?|xlsx?|pptx?|csv)$/i) !== null
    );
  };

  const handleLoadSuccess = () => {
    console.log('Document preview loaded successfully');
    setIsLoading(false);
    setPreviewError(null);
  };

  const handleLoadError = () => {
    console.error('Error loading document preview');
    setIsLoading(false);
    setPreviewError('Failed to load document preview. The document may be inaccessible or in an unsupported format.');
  };

  const handleDownload = () => {
    if (!document) return;
    
    if (document.url) {
      window.open(document.url, '_blank');
    } else {
      toast.error('Document URL is not available for download');
    }
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
