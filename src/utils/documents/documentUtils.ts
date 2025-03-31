
import { DocumentFile } from '@/types/documents';

/**
 * Sanitize a document URL to ensure it's properly formatted
 * @param url The URL to sanitize
 * @returns A properly formatted URL
 */
export const sanitizeDocumentUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    // Replace spaces with %20
    url = url.replace(/ /g, '%20');
    
    // Check if the URL is already encoded
    const decoded = decodeURIComponent(url);
    if (decoded !== url) {
      return url;
    }
    
    // Validate URL
    new URL(url);
    return url;
  } catch (error) {
    console.error('Invalid URL:', url, error);
    return '';
  }
};

/**
 * Check if a file type should use Office Online Viewer
 * @param fileType The file type/mime type
 * @returns Boolean indicating if Office viewer should be used
 */
export const canUseOfficeViewer = (fileType: string): boolean => {
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

/**
 * Get the appropriate icon and color for a file type
 * @param fileType The file type/mime type
 * @returns Object with icon name and color
 */
export const getFileTypeInfo = (fileType: string): { icon: string; color: string } => {
  const type = fileType.toLowerCase();
  
  if (type.includes('pdf')) {
    return { icon: 'file-pdf', color: 'text-red-500' };
  } else if (type.includes('image') || type.match(/\.(jpe?g|png|gif|svg|webp)$/i)) {
    return { icon: 'image', color: 'text-blue-500' };
  } else if (canUseOfficeViewer(type)) {
    if (type.includes('word') || type.includes('document')) {
      return { icon: 'file-text', color: 'text-blue-700' };
    } else if (type.includes('excel') || type.includes('sheet')) {
      return { icon: 'table', color: 'text-green-600' };
    } else if (type.includes('powerpoint') || type.includes('presentation')) {
      return { icon: 'presentation', color: 'text-orange-500' };
    }
  }
  
  // Default
  return { icon: 'file', color: 'text-gray-500' };
};

/**
 * Get document metadata from Supabase from the document ID
 * @param documentId The document ID
 * @returns Promise resolving to document data
 */
export const getDocumentById = async (documentId: string): Promise<DocumentFile | null> => {
  if (!documentId) return null;
  
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();
    
    if (error) {
      console.error('Error fetching document:', error);
      return null;
    }
    
    return data as DocumentFile;
  } catch (error) {
    console.error('Exception fetching document:', error);
    return null;
  }
};

/**
 * Check if a document is previewable
 * @param fileType The file type/mime type
 * @returns Boolean indicating if the file can be previewed
 */
export const isPreviewable = (fileType: string): boolean => {
  const type = fileType.toLowerCase();
  
  return (
    type.includes('pdf') ||
    type.includes('image') ||
    type.match(/\.(jpe?g|png|gif|svg|webp)$/i) !== null ||
    canUseOfficeViewer(type) ||
    type.includes('text') ||
    type.includes('html')
  );
};
