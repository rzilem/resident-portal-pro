
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
  console.log(`Validating file type: ${file.type} against accepted types:`, acceptedTypes);
  return acceptedTypes.includes(file.type);
};

/**
 * Validate file size against a maximum size
 * @param file File to validate
 * @param maxSizeInBytes Maximum file size in bytes
 * @returns Boolean indicating if the file size is valid
 */
export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  console.log(`Validating file size: ${file.size} bytes against max size: ${maxSizeInBytes} bytes`);
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

/**
 * Get file extension from a filename
 * @param filename The filename to extract extension from
 * @returns The file extension (without the dot)
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop() || '';
};

/**
 * Generate a unique filename to avoid collisions
 * @param originalName Original filename
 * @returns Unique filename with timestamp
 */
export const generateUniqueFileName = (originalName: string): string => {
  const extension = getFileExtension(originalName);
  const timestamp = Date.now();
  const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
  return `${baseName}_${timestamp}.${extension}`;
};

/**
 * Get an icon name based on file type
 * @param fileType MIME type of the file
 * @returns Icon name to use for the file type
 */
export const getFileTypeIcon = (fileType: string): string => {
  if (fileType.includes('pdf')) return 'file-text';
  if (fileType.includes('word') || fileType.includes('document')) return 'file-text';
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'file-spreadsheet';
  if (fileType.includes('image')) return 'image';
  if (fileType.includes('video')) return 'video';
  if (fileType.includes('audio')) return 'headphones';
  if (fileType.includes('zip') || fileType.includes('compressed')) return 'archive';
  return 'file';
};

/**
 * Read a file as a Data URL (base64)
 * @param file File to read
 * @returns Promise that resolves with the file contents as a Data URL
 */
export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as Data URL'));
      }
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsDataURL(file);
  });
};
