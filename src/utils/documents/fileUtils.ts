/**
 * File utility functions for document management
 */

/**
 * Validate file size
 * @param file File to validate
 * @param maxSizeMB Maximum file size in MB
 */
export const validateFileSize = (file: File, maxSizeMB: number): void => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`File is too large. Maximum size is ${maxSizeMB}MB.`);
  }
};

/**
 * Validate file type
 * @param file File to validate
 * @param allowedTypes Array of allowed MIME types or extensions
 */
export const validateFileType = (file: File, allowedTypes: string[]): void => {
  // Check if any of the allowed types is in the file's type
  const isMimeTypeAllowed = allowedTypes.some(type => {
    // If type contains a slash, it's a MIME type
    if (type.includes('/')) {
      return file.type === type || file.type.startsWith(type.split('/')[0] + '/');
    }
    // Otherwise, it's a file extension (like '.pdf')
    else {
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    }
  });

  if (!isMimeTypeAllowed) {
    throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }
};

/**
 * Format file size to human-readable format
 * @param bytes Size in bytes
 * @returns Formatted string (e.g. '5.2 MB')
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get appropriate icon classname based on file type
 * @param file The file object
 * @returns CSS class for icon color
 */
export const getFileIconColor = (file: File): string => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (['pdf'].includes(extension || '')) {
    return 'text-red-500';
  } else if (['doc', 'docx'].includes(extension || '')) {
    return 'text-blue-500';
  } else if (['xls', 'xlsx', 'csv'].includes(extension || '')) {
    return 'text-green-500';
  } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
    return 'text-purple-500';
  } else if (['zip', 'rar', '7z'].includes(extension || '')) {
    return 'text-amber-500';
  }
  
  return 'text-gray-500';
};

/**
 * Check if a file is an image
 * @param file The file to check
 * @returns Boolean indicating if file is an image
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
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
