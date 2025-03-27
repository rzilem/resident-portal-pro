
/**
 * File utilities for document management
 */

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Format date in human readable format
 * @param {string} dateString - Date string
 * @param {Intl.DateTimeFormatOptions} options - Format options
 * @returns {string} Formatted date
 */
export const formatDate = (dateString: string, options: Intl.DateTimeFormatOptions = {}): string => {
  try {
    const date = new Date(dateString);
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Get file extension from file name
 * @param {string} fileName - File name
 * @returns {string} File extension
 */
export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

/**
 * Check if file type is allowed
 * @param {File} file - File to check
 * @param {string[]} allowedTypes - Allowed MIME types
 * @returns {boolean} True if file type is allowed
 */
export const isAllowedFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * Validate file type (alias for isAllowedFileType for backward compatibility)
 * @param {File} file - File to check
 * @param {string[]} allowedTypes - Allowed MIME types
 * @returns {boolean} True if file type is allowed
 */
export const validateFileType = isAllowedFileType;

/**
 * Validate file size
 * @param {File} file - File to check
 * @param {number} maxSizeMB - Maximum file size in megabytes (default: 5MB)
 * @returns {boolean} True if file size is within limit
 * @throws {Error} If file size exceeds the limit
 */
export const validateFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  if (file.size > maxSizeBytes) {
    throw new Error(`File size exceeds maximum allowed (${maxSizeMB}MB)`);
  }
  return true;
};

/**
 * Check if file size is within limit (alternative to validateFileSize)
 * @param {File} file - File to check
 * @param {number} maxSizeBytes - Maximum file size in bytes
 * @returns {boolean} True if file size is within limit
 */
export const isFileSizeValid = (file: File, maxSizeBytes: number): boolean => {
  return file.size <= maxSizeBytes;
};

/**
 * Generate a unique file name
 * @param {File} file - Original file
 * @returns {string} Unique file name
 */
export const generateUniqueFileName = (file: File): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 12);
  const extension = getFileExtension(file.name);
  const sanitizedName = file.name
    .replace(/\.[^/.]+$/, "") // Remove extension
    .replace(/[^a-z0-9]/gi, "-") // Replace special chars with dash
    .toLowerCase();
    
  return `${sanitizedName}-${timestamp}-${randomString}.${extension}`;
};

/**
 * Get appropriate icon for file type
 * @param {string} fileType - MIME type of file
 * @returns {string} Icon name for file type
 */
export const getFileTypeIcon = (fileType: string): string => {
  if (fileType.includes('pdf')) return 'pdf';
  if (fileType.includes('word') || fileType.includes('doc')) return 'word';
  if (fileType.includes('excel') || fileType.includes('sheet') || fileType.includes('xls')) return 'excel';
  if (fileType.includes('powerpoint') || fileType.includes('presentation') || fileType.includes('ppt')) return 'powerpoint';
  if (fileType.includes('image')) return 'image';
  if (fileType.includes('text')) return 'text';
  if (fileType.includes('zip') || fileType.includes('compressed')) return 'archive';
  if (fileType.includes('audio')) return 'audio';
  if (fileType.includes('video')) return 'video';
  return 'file';
};

/**
 * Create a downloadable file from URL
 * @param {string} url - File URL
 * @param {string} fileName - File name
 */
export const downloadFile = (url: string, fileName: string): void => {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

/**
 * Read file as data URL
 * @param {File} file - File to read
 * @returns {Promise<string>} Data URL
 */
export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
