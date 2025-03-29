
/**
 * Format file size from bytes to human-readable format
 * @param bytes File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if a file is previewable in browser
 * @param fileType The file's MIME type or extension
 * @returns Boolean indicating if file can be previewed
 */
export const isFilePreviewable = (fileType: string): boolean => {
  if (!fileType) return false;
  
  const lowerType = fileType.toLowerCase();
  
  // Expanded list of previewable file types
  const previewableTypes = [
    'pdf', 'application/pdf',
    'jpeg', 'jpg', 'png', 'gif', 'svg', 'webp', 'bmp',
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp', 'image/bmp'
  ];
  
  // Check if any of the previewable types is included in the fileType
  return previewableTypes.some(type => lowerType.includes(type));
};

/**
 * Get the MIME type from a file name or extension
 * @param fileName The file name or extension
 * @returns The corresponding MIME type
 */
export const getMimeTypeFromFileName = (fileName: string): string => {
  if (!fileName) return 'application/octet-stream';
  
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  const mimeTypes: Record<string, string> = {
    'pdf': 'application/pdf',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',
    'bmp': 'image/bmp',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'txt': 'text/plain',
    'csv': 'text/csv',
    'html': 'text/html',
    'htm': 'text/html',
    'json': 'application/json',
    'xml': 'application/xml',
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    'mp4': 'video/mp4',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav'
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
};

/**
 * Detect if we can generate an Office Online preview URL
 * @param fileType The file's MIME type or extension
 * @returns Boolean indicating if file can use Office Online viewer
 */
export const canUseOfficeViewer = (fileType: string): boolean => {
  if (!fileType) return false;
  
  const lowerType = fileType.toLowerCase();
  
  // Office file extensions
  const officeExtensions = [
    'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'vnd.ms-word', 'vnd.openxmlformats-officedocument.wordprocessingml', 
    'vnd.ms-excel', 'vnd.openxmlformats-officedocument.spreadsheetml',
    'vnd.ms-powerpoint', 'vnd.openxmlformats-officedocument.presentationml'
  ];
  
  // Check if any of the office extensions is included in the fileType
  const isOfficeDocument = officeExtensions.some(ext => lowerType.includes(ext));
    
  console.log(`Checking if "${lowerType}" can use Office viewer: ${isOfficeDocument}`);
  return isOfficeDocument;
};

/**
 * Generate an Office Online viewer URL
 * @param fileUrl The URL of the file
 * @returns Office Online viewer URL
 */
export const getOfficeViewerUrl = (fileUrl: string): string => {
  // Ensure the fileUrl is properly encoded
  const encodedFileUrl = encodeURIComponent(fileUrl);
  console.log(`Creating Office viewer URL for: ${fileUrl}`);
  console.log(`Encoded URL: ${encodedFileUrl}`);
  return `https://view.officeapps.live.com/op/view.aspx?src=${encodedFileUrl}`;
};
