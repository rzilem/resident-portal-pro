
import { DocumentFile } from '@/types/documents';

/**
 * Get formatted file size with appropriate units (KB, MB, GB)
 * @param bytes File size in bytes
 * @param decimals Number of decimal places to display
 * @returns Formatted file size with units
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * Get appropriate icon/color for document based on file type
 * @param fileType MIME type or file extension
 * @returns Object containing icon type and color class
 */
export const getDocumentTypeInfo = (fileType: string): { icon: string; colorClass: string } => {
  // Get file extension from MIME type or full file name if needed
  const fileExt = fileType.includes('/') 
    ? fileType.split('/')[1]
    : fileType.includes('.') 
      ? fileType.split('.').pop() || fileType
      : fileType;
  
  // Map file extensions/types to icons and color classes
  switch(fileExt.toLowerCase()) {
    case 'pdf':
      return { icon: 'file-text', colorClass: 'text-red-500' };
    case 'doc':
    case 'docx':
    case 'odt':
      return { icon: 'file-text', colorClass: 'text-blue-500' };
    case 'xls':
    case 'xlsx':
    case 'csv':
      return { icon: 'file-spreadsheet', colorClass: 'text-green-500' };
    case 'ppt':
    case 'pptx':
      return { icon: 'file-presentation', colorClass: 'text-orange-500' };
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'svg':
      return { icon: 'image', colorClass: 'text-purple-500' };
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'webm':
      return { icon: 'video', colorClass: 'text-pink-500' };
    case 'mp3':
    case 'wav':
    case 'ogg':
      return { icon: 'audio', colorClass: 'text-indigo-500' };
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return { icon: 'archive', colorClass: 'text-yellow-500' };
    default:
      return { icon: 'file', colorClass: 'text-gray-500' };
  }
};

/**
 * Check if document is viewable in browser
 * @param fileType MIME type or file extension
 * @returns Boolean indicating if file can be previewed in browser
 */
export const isPreviewableDocument = (fileType: string): boolean => {
  // Handle both MIME types and file extensions
  if (fileType.includes('/')) {
    // MIME type format
    const mimeType = fileType.toLowerCase();
    
    return (
      mimeType.startsWith('image/') ||
      mimeType === 'application/pdf' ||
      mimeType === 'text/plain' ||
      mimeType === 'text/html' ||
      mimeType === 'text/css' ||
      mimeType === 'text/javascript' ||
      mimeType === 'text/csv' ||
      mimeType === 'application/json'
    );
  } else {
    // File extension format
    const ext = fileType.startsWith('.') ? fileType.substring(1) : fileType;
    const lowerExt = ext.toLowerCase();
    
    return [
      'pdf', 'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp',
      'txt', 'html', 'htm', 'css', 'js', 'json', 'csv'
    ].includes(lowerExt);
  }
};

/**
 * Check if document should use Google Docs Viewer for preview
 * @param fileType MIME type or file extension
 * @returns Boolean indicating if Google Docs viewer should be used
 */
export const useGoogleDocsViewer = (fileType: string): boolean => {
  // Handle both MIME types and file extensions
  if (fileType.includes('/')) {
    // MIME type format
    const mimeType = fileType.toLowerCase();
    
    return (
      mimeType === 'application/pdf' ||
      mimeType === 'application/msword' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/vnd.ms-excel' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      mimeType === 'application/vnd.ms-powerpoint' ||
      mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    );
  } else {
    // File extension format
    const ext = fileType.startsWith('.') ? fileType.substring(1) : fileType;
    const lowerExt = ext.toLowerCase();
    
    return [
      'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'
    ].includes(lowerExt);
  }
};

/**
 * Sort documents by specified field
 * @param documents List of documents to sort
 * @param sortField Field to sort by
 * @param sortDirection 'asc' for ascending, 'desc' for descending
 * @returns Sorted list of documents
 */
export const sortDocuments = (
  documents: DocumentFile[],
  sortField: keyof DocumentFile = 'uploadedDate',
  sortDirection: 'asc' | 'desc' = 'desc'
): DocumentFile[] => {
  return [...documents].sort((a, b) => {
    let valueA = a[sortField];
    let valueB = b[sortField];
    
    // Handle date fields
    if (['uploadedDate', 'lastModified'].includes(sortField as string)) {
      valueA = new Date(valueA as string).getTime();
      valueB = new Date(valueB as string).getTime();
    }
    
    // Handle string fields
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    
    // Handle number fields
    if (valueA === valueB) return 0;
    
    if (sortDirection === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
};
