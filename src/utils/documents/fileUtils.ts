
/**
 * Validates file size
 * @param file File to validate
 * @param maxSizeMB Maximum file size in MB
 * @throws Error if file is too large
 */
export const validateFileSize = (file: File, maxSizeMB: number): void => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
  }
};

/**
 * Validates file type
 * @param file File to validate
 * @param allowedTypes Array of allowed MIME types
 * @throws Error if file type is not allowed
 */
export const validateFileType = (file: File, allowedTypes: string[]): void => {
  // Check if the file type is explicitly in the allowed types list
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    // Special case for images
    if (file.type.startsWith('image/') && allowedTypes.includes('image/*')) {
      return;
    }
    
    // Special case for PDFs
    if (file.type === 'application/pdf' && allowedTypes.includes('application/pdf')) {
      return;
    }
    
    // Check for file extension matches if MIME type doesn't match
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const hasMatchingExtension = allowedTypes.some(type => {
      // Extract extension from MIME type (e.g., 'application/pdf' -> 'pdf')
      const typeExt = type.split('/').pop();
      return typeExt === fileExt || typeExt === '*';
    });
    
    if (!hasMatchingExtension) {
      throw new Error('File type is not allowed');
    }
  }
};

/**
 * Format bytes to a human-readable string
 * @param bytes Number of bytes
 * @param decimals Number of decimal places
 * @returns Formatted string (e.g., "1.5 MB")
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
