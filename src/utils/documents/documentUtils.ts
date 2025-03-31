
/**
 * Document utilities for fetching and manipulating document data
 */
import { DocumentCategory, DocumentAccessLevel } from '@/types/documents';
import { supabase } from '@/integrations/supabase/client';

/**
 * Format file size to human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get document categories
 * @returns {Promise<DocumentCategory[]>} List of document categories
 */
export const getDocumentCategories = async (): Promise<DocumentCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('document_categories')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching document categories:', error);
      throw error;
    }
    
    // Map database fields to our DocumentCategory interface
    return (data || []).map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description || '',
      accessLevel: (cat.access_level || 'all') as DocumentAccessLevel,
      sortOrder: cat.sort_order,
    }));
  } catch (error) {
    console.error('Error in getDocumentCategories:', error);
    return [];
  }
};

/**
 * Check if a file type can be previewed directly in the browser
 * @param fileType MIME type or file extension
 * @returns Boolean indicating if the file can be previewed
 */
export const isFilePreviewable = (fileType: string): boolean => {
  const type = fileType.toLowerCase();
  
  // Common previewable file types
  return (
    type.includes('pdf') ||
    type.includes('image/') ||
    type.includes('jpg') ||
    type.includes('jpeg') ||
    type.includes('png') ||
    type.includes('gif') ||
    type.includes('svg') ||
    type.includes('webp') ||
    type.includes('text/') ||
    type.includes('html') ||
    type.includes('xml') ||
    type.includes('json')
  );
};

/**
 * Get MIME type from a filename based on its extension
 * @param fileName Filename with extension
 * @returns MIME type string
 */
export const getMimeTypeFromFileName = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  const mimeTypeMap: Record<string, string> = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',
    'txt': 'text/plain',
    'html': 'text/html',
    'htm': 'text/html',
    'xml': 'text/xml',
    'json': 'application/json',
    'mp4': 'video/mp4',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'zip': 'application/zip',
    'rar': 'application/vnd.rar',
    '7z': 'application/x-7z-compressed',
    'csv': 'text/csv'
  };
  
  return mimeTypeMap[extension] || 'application/octet-stream';
};

/**
 * Check if a document can be previewed with Office Online Viewer
 * @param fileType Document file type or extension
 * @returns Boolean indicating if Office Viewer can be used
 */
export const canUseOfficeViewer = (fileType: string): boolean => {
  const type = fileType.toLowerCase();
  
  return (
    type.includes('word') ||
    type.includes('doc') ||
    type.includes('excel') ||
    type.includes('xls') ||
    type.includes('powerpoint') ||
    type.includes('ppt') ||
    type.includes('ms-office') ||
    type.includes('officedocument')
  );
};

/**
 * Get Office Online Viewer URL for a document
 * @param url Original document URL
 * @returns Office Viewer URL
 */
export const getOfficeViewerUrl = (url: string): string => {
  // Microsoft Office Online Viewer
  return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;
};

/**
 * Sanitize a document URL to ensure it's safe
 * @param url Document URL to sanitize
 * @returns Sanitized URL
 */
export const sanitizeDocumentUrl = (url: string): string => {
  if (!url) return '';
  
  // Ensure URL is properly encoded
  try {
    // Replace spaces with %20
    url = url.replace(/ /g, '%20');
    
    // Check if the URL is already encoded and avoid double encoding
    const decoded = decodeURIComponent(url);
    if (decoded !== url) {
      // URL is already encoded
      return url;
    }
    
    // Parse the URL to make sure it's valid
    new URL(url);
    
    return url;
  } catch (error) {
    console.error('Invalid URL:', url, error);
    return '';
  }
};

/**
 * Format a date string to a human-readable format
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};
