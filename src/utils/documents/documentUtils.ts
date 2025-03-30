
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
  return lowerType.includes('pdf') || 
         lowerType.includes('image') || 
         lowerType.includes('jpg') || 
         lowerType.includes('jpeg') || 
         lowerType.includes('png') || 
         lowerType.includes('gif') ||
         lowerType.includes('svg') ||
         lowerType.includes('webp');
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
 * Sanitize the URL to ensure it's valid and safe
 * @param url The URL to sanitize
 * @returns Sanitized URL
 */
export const sanitizeDocumentUrl = (url: string): string => {
  if (!url) return '';
  
  // Special case for lovable uploads
  if (url.startsWith('/lovable-uploads/')) {
    return url;
  }
  
  // Ensure protocol is specified
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

/**
 * Get available document categories
 * @returns Promise<{id: string, name: string, accessLevel?: DocumentAccessLevel}[]> Array of categories
 */
export const getDocumentCategories = async (): Promise<{id: string, name: string, parent?: string, description?: string, isRestricted?: boolean, requiredPermission?: string, sortOrder?: number, accessLevel?: import('@/types/documents').DocumentAccessLevel}[]> => {
  try {
    // First try to get categories from database
    // For now, we'll use the imported function from uploadUtils
    // In a real app, we would implement the DB query here
    const { getDocumentCategories: fetchCategories } = await import('./uploadUtils');
    const categories = await fetchCategories();
    
    // Convert each category to ensure accessLevel is properly typed
    return categories.map(category => {
      // Make sure we return an object with the correct properties
      return {
        id: category.id,
        name: category.name,
        parent: category.parent,
        description: category.description,
        isRestricted: category.isRestricted,
        requiredPermission: category.requiredPermission,
        sortOrder: category.sortOrder,
        // Ensure accessLevel is properly typed
        accessLevel: category.accessLevel as import('@/types/documents').DocumentAccessLevel || 'all'
      };
    });
  } catch (error) {
    console.error('Error fetching document categories:', error);
    
    // Return default categories on error
    return [
      { id: 'GENERAL', name: 'GENERAL', accessLevel: 'all' as import('@/types/documents').DocumentAccessLevel },
      { id: 'FINANCIAL', name: 'FINANCIAL', accessLevel: 'board' as import('@/types/documents').DocumentAccessLevel },
      { id: 'LEGAL', name: 'LEGAL', accessLevel: 'management' as import('@/types/documents').DocumentAccessLevel },
      { id: 'MAINTENANCE', name: 'MAINTENANCE', accessLevel: 'all' as import('@/types/documents').DocumentAccessLevel },
      { id: 'MEETING', name: 'MEETING', accessLevel: 'homeowner' as import('@/types/documents').DocumentAccessLevel }
    ];
  }
};

/**
 * Detect if we can generate an Office Online preview URL
 * @param fileType The file's MIME type or extension
 * @returns Boolean indicating if file can use Office Online viewer
 */
export const canUseOfficeViewer = (fileType: string): boolean => {
  if (!fileType) return false;
  
  const lowerType = fileType.toLowerCase();
  
  return lowerType.includes('word') || 
         lowerType.includes('doc') || 
         lowerType.includes('xls') || 
         lowerType.includes('xlsx') || 
         lowerType.includes('ppt') || 
         lowerType.includes('pptx');
};

/**
 * Generate an Office Online viewer URL
 * @param fileUrl The URL of the file
 * @returns Office Online viewer URL
 */
export const getOfficeViewerUrl = (fileUrl: string): string => {
  // Ensure the fileUrl is properly encoded
  const encodedFileUrl = encodeURIComponent(fileUrl);
  return `https://view.officeapps.live.com/op/view.aspx?src=${encodedFileUrl}`;
};
