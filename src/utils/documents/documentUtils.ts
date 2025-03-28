
/**
 * Format file size from bytes to human-readable format
 * @param bytes File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if a file is previewable in browser
 * @param fileType The file's MIME type or extension
 * @returns Boolean indicating if file can be previewed
 */
export const isFilePreviewable = (fileType: string): boolean => {
  const lowerType = fileType.toLowerCase();
  
  // Check for previewable file types
  return lowerType.includes('pdf') || 
         lowerType.includes('image') || 
         lowerType.includes('jpg') || 
         lowerType.includes('jpeg') || 
         lowerType.includes('png') || 
         lowerType.includes('gif');
};

/**
 * Sanitize the URL to ensure it's valid and safe
 * @param url The URL to sanitize
 * @returns Sanitized URL
 */
export const sanitizeDocumentUrl = (url: string): string => {
  // Ensure protocol is specified
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};
