
/**
 * Utility functions for handling files
 */

/**
 * Validate file size
 * @param file File to validate
 * @param maxSizeMB Maximum size in MB
 */
export const validateFileSize = (file: File, maxSizeMB: number): void => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`File size exceeds ${maxSizeMB}MB limit. Please select a smaller file.`);
  }
};

/**
 * Validate file type
 * @param file File to validate
 * @param allowedTypes Array of allowed MIME types
 */
export const validateFileType = (file: File, allowedTypes: string[]): void => {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type "${file.type}" is not supported. Allowed types: ${allowedTypes.join(', ')}`);
  }
};

/**
 * Format file size from bytes to human-readable
 * @param bytes File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file extension from filename
 * @param filename Filename
 * @returns File extension without dot
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};
