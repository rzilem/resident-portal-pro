
/**
 * File utility functions for document management
 */

/**
 * Validate file size
 * @param file File to validate
 * @param maxSizeMB Maximum file size in MB
 * @throws Error if file size exceeds maximum
 */
export const validateFileSize = (file: File, maxSizeMB: number): void => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`File size exceeds maximum allowed size (${maxSizeMB}MB)`);
  }
};

/**
 * Validate file type
 * @param file File to validate
 * @param allowedTypes Array of allowed MIME types
 * @throws Error if file type is not allowed
 */
export const validateFileType = (file: File, allowedTypes: string[]): void => {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type "${file.type}" is not allowed`);
  }
};

/**
 * Format file size for display
 * @param bytes File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Download a file from a URL
 * @param url URL of the file to download
 * @param filename Optional filename for the downloaded file
 */
export const downloadFile = (url: string, filename?: string): void => {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || url.split('/').pop() || 'download';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
