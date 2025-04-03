
/**
 * Format bytes to human-readable format
 * @param bytes Number of bytes
 * @param decimals Number of decimal places
 * @returns Formatted string (e.g. "1.5 MB")
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Format file size to human-readable format (alias for formatBytes)
 * @param size Size in bytes
 * @param decimals Number of decimal places
 * @returns Formatted string
 */
export const formatFileSize = (size: number, decimals: number = 2): string => {
  return formatBytes(size, decimals);
};

/**
 * Validate file size
 * @param file The file to validate
 * @param maxSizeMB Maximum file size in MB
 * @returns true if valid, false if not
 */
export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Validate file type
 * @param file The file to validate
 * @param allowedTypes Array of allowed MIME types (e.g. 'image/jpeg')
 * @throws Error if file type is not allowed
 */
export const validateFileType = (file: File, allowedTypes: string[]): void => {
  // If allowedTypes includes '*/*', all types are allowed
  if (allowedTypes.includes('*/*')) {
    return;
  }
  
  // Check if the file type matches any of the allowed types
  const isAllowed = allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      // Handle wildcard MIME types (e.g. 'image/*')
      const category = type.split('/')[0];
      return file.type.startsWith(category + '/');
    }
    return file.type === type;
  });
  
  if (!isAllowed) {
    throw new Error(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }
};

/**
 * Get file extension from file name
 * @param fileName File name
 * @returns File extension (e.g. "pdf")
 */
export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

/**
 * Check if a file is an image
 * @param fileType MIME type of the file
 * @returns true if the file is an image
 */
export const isImageFile = (fileType: string): boolean => {
  return fileType.startsWith('image/');
};

/**
 * Get image dimensions (width and height)
 * @param imageUrl URL of the image
 * @returns Promise that resolves to an object with width and height
 */
export const getImageDimensions = (imageUrl: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = imageUrl;
  });
};
