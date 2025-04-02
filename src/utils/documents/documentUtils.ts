
/**
 * Format file size to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Determine if a file is an image based on extension or MIME type
 */
export const isImageFile = (fileNameOrType: string): boolean => {
  const lower = fileNameOrType.toLowerCase();
  return (
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.png') ||
    lower.endsWith('.gif') ||
    lower.endsWith('.svg') ||
    lower.endsWith('.webp') ||
    lower.includes('image/')
  );
};

/**
 * Determine if a file is a PDF based on extension or MIME type
 */
export const isPdfFile = (fileNameOrType: string): boolean => {
  const lower = fileNameOrType.toLowerCase();
  return lower.endsWith('.pdf') || lower.includes('application/pdf');
};

/**
 * Determine if a file is an Office document
 */
export const isOfficeFile = (fileNameOrType: string): boolean => {
  const lower = fileNameOrType.toLowerCase();
  return (
    lower.endsWith('.doc') ||
    lower.endsWith('.docx') ||
    lower.endsWith('.ppt') ||
    lower.endsWith('.pptx') ||
    lower.endsWith('.xls') ||
    lower.endsWith('.xlsx') ||
    lower.includes('ms-word') ||
    lower.includes('ms-excel') ||
    lower.includes('ms-powerpoint') ||
    lower.includes('office')
  );
};
