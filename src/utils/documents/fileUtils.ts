
/**
 * Utility functions for handling file operations
 */

/**
 * Validates the file size
 * @param file The file to validate
 * @param maxSizeMB Maximum file size in MB
 * @throws Error if the file size exceeds the maximum
 */
export const validateFileSize = (file: File, maxSizeMB: number): void => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
  }
};

/**
 * Validates the file type
 * @param file The file to validate
 * @param allowedTypes Array of allowed MIME types
 * @throws Error if the file type is not allowed
 */
export const validateFileType = (file: File, allowedTypes: string[]): void => {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed`);
  }
};

/**
 * Formats a file size in bytes to a human-readable format
 * @param bytes File size in bytes
 * @returns Formatted file size (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Gets the file extension from a file name
 * @param fileName The file name
 * @returns The file extension (e.g., "pdf")
 */
export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

/**
 * Generates a unique file name
 * @param originalName The original file name
 * @returns A unique file name with timestamp
 */
export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const extension = getFileExtension(originalName);
  const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
  
  return `${baseName}-${timestamp}.${extension}`;
};

/**
 * Get file type icon based on file extension
 * @param extension File extension (e.g., "pdf", "docx")
 * @returns Icon name or default icon
 */
export const getFileTypeIcon = (extension: string): string => {
  const iconMap: Record<string, string> = {
    'pdf': 'file-pdf',
    'doc': 'file-word',
    'docx': 'file-word',
    'xls': 'file-excel',
    'xlsx': 'file-excel',
    'ppt': 'file-powerpoint',
    'pptx': 'file-powerpoint',
    'jpg': 'file-image',
    'jpeg': 'file-image',
    'png': 'file-image',
    'gif': 'file-image',
    'txt': 'file-text',
    'csv': 'file-spreadsheet',
    'zip': 'file-archive',
    'rar': 'file-archive',
  };
  
  return iconMap[extension.toLowerCase()] || 'file';
};

/**
 * Download a file from a URL
 * @param url The URL of the file to download
 * @param fileName The name to save the file as
 */
export const downloadFile = (url: string, fileName: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Read a file as a data URL
 * @param file The file to read
 * @returns Promise resolving to the file data URL
 */
export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
