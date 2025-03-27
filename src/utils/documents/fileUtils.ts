
/**
 * Utility functions for file operations
 */

/**
 * Format file size in a human-readable format
 * @param bytes File size in bytes
 * @returns Formatted file size string (e.g., "1.2 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format date in a human-readable format
 * @param dateStr Date string
 * @returns Formatted date string
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

/**
 * Validate file type against a list of accepted types
 * @param file File to validate
 * @param acceptedTypes Array of accepted MIME types
 * @returns Boolean indicating if the file type is valid
 */
export const validateFileType = (file: File, acceptedTypes: string[]): boolean => {
  return acceptedTypes.includes(file.type);
};

/**
 * Validate file size against a maximum size
 * @param file File to validate
 * @param maxSizeInBytes Maximum file size in bytes
 * @returns Boolean indicating if the file size is valid
 */
export const validateFileSize = (file: File, maxSizeInBytes: number): boolean => {
  return file.size <= maxSizeInBytes;
};

/**
 * Download a file from a URL
 * @param url URL of the file to download
 * @param filename Filename to use for the download
 */
export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
