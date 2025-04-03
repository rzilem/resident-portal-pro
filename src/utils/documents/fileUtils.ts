
/**
 * Convert a data URL to a File object
 * @param dataUrl Data URL to convert
 * @param filename Filename to use for the File object
 * @returns File object created from the data URL
 */
export const dataURLtoFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || '';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
};

/**
 * Get file extension from filename or MIME type
 * @param fileNameOrType Filename or MIME type
 * @returns File extension (without the dot)
 */
export const getFileExtension = (fileNameOrType: string): string => {
  if (fileNameOrType.includes('/')) {
    // It's a MIME type
    return fileNameOrType.split('/')[1];
  }
  
  // It's a filename
  return fileNameOrType.split('.').pop()?.toLowerCase() || '';
};

/**
 * Get MIME type from file extension
 * @param extension File extension (with or without the dot)
 * @returns MIME type for the extension
 */
export const getMimeTypeFromExtension = (extension: string): string => {
  const ext = extension.startsWith('.') ? extension.substring(1) : extension;
  
  const mimeMap: Record<string, string> = {
    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'txt': 'text/plain',
    
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',
    
    // Audio
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',
    
    // Video
    'mp4': 'video/mp4',
    'avi': 'video/x-msvideo',
    'mov': 'video/quicktime',
    'webm': 'video/webm',
    
    // Archive
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    
    // Code
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'json': 'application/json',
    'xml': 'application/xml',
    'csv': 'text/csv'
  };
  
  return mimeMap[ext.toLowerCase()] || 'application/octet-stream';
};

/**
 * Validate file size
 * @param file File to validate
 * @param maxSizeMB Maximum file size in MB
 * @returns Boolean indicating if file size is valid
 */
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Validate file type against allowed types
 * @param file File to validate
 * @param allowedTypes Array of allowed MIME types or extensions
 * @returns Boolean indicating if file type is valid
 */
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  if (allowedTypes.includes('*/*') || allowedTypes.includes('*')) {
    return true;
  }
  
  // Convert file's type to lowercase for case-insensitive comparison
  const fileType = file.type.toLowerCase();
  const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
  
  return allowedTypes.some(type => {
    const lowerType = type.toLowerCase();
    
    // Check for wildcard matches (e.g., "image/*")
    if (lowerType.endsWith('/*')) {
      const prefix = lowerType.split('/')[0];
      return fileType.startsWith(prefix + '/');
    }
    
    // Check for direct MIME type match
    if (fileType === lowerType) {
      return true;
    }
    
    // Check for extension match (with or without dot)
    const typeExt = lowerType.startsWith('.') ? lowerType : '.' + lowerType;
    return typeExt === fileExt;
  });
};
