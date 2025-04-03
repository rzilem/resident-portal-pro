
import { DocumentFile, Tag } from '@/types/documents';

/**
 * Normalize a string for case-insensitive comparison
 * @param value String to normalize
 * @returns Normalized string (lowercase, trimmed)
 */
export const normalizeString = (value: string): string => {
  return value ? value.toLowerCase().trim() : '';
};

/**
 * Check if a document matches a search query
 * @param doc Document to check
 * @param query Search query
 * @returns True if document matches query
 */
export const documentMatchesSearch = (doc: DocumentFile, query: string): boolean => {
  if (!query || query.trim() === '') return true;
  
  const normalizedQuery = normalizeString(query);
  
  // Check name and description
  if (normalizeString(doc.name).includes(normalizedQuery)) return true;
  if (doc.description && normalizeString(doc.description).includes(normalizedQuery)) return true;
  
  // Check tags (can be string[] or Tag[])
  if (doc.tags && doc.tags.length > 0) {
    for (const tag of doc.tags) {
      if (typeof tag === 'string' && normalizeString(tag).includes(normalizedQuery)) return true;
      if (typeof tag === 'object' && tag.name && normalizeString(tag.name).includes(normalizedQuery)) return true;
    }
  }
  
  // Check category
  if (doc.category && normalizeString(doc.category).includes(normalizedQuery)) return true;
  
  return false;
};

/**
 * Get document file size in human-readable format
 * @param bytes Size in bytes
 * @returns Formatted file size (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number | undefined): string => {
  if (bytes === undefined || bytes === 0) return '0 B';
  
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get a friendly name for a document file type
 * @param fileType MIME type or file extension
 * @returns Human-readable file type
 */
export const getReadableFileType = (fileType: string): string => {
  // Handle MIME types
  if (fileType.startsWith('application/pdf')) return 'PDF';
  if (fileType.startsWith('application/msword') || 
      fileType.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml')) return 'Word';
  if (fileType.startsWith('application/vnd.ms-excel') || 
      fileType.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml')) return 'Excel';
  if (fileType.startsWith('application/vnd.ms-powerpoint') || 
      fileType.startsWith('application/vnd.openxmlformats-officedocument.presentationml')) return 'PowerPoint';
  if (fileType.startsWith('image/')) return fileType.split('/')[1].toUpperCase();
  if (fileType.startsWith('text/')) return 'Text';
  
  // Handle file extensions
  const extension = fileType.split('.').pop()?.toLowerCase();
  if (extension) {
    if (['pdf'].includes(extension)) return 'PDF';
    if (['doc', 'docx'].includes(extension)) return 'Word';
    if (['xls', 'xlsx'].includes(extension)) return 'Excel';
    if (['ppt', 'pptx'].includes(extension)) return 'PowerPoint';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) return extension.toUpperCase();
    if (['txt', 'rtf', 'md'].includes(extension)) return 'Text';
  }
  
  // Default case
  return fileType || 'Unknown';
};

/**
 * Check if a document should be visible based on its category access level and user role
 * @param doc Document to check
 * @param userRole User's role
 * @param categoryAccessLevels Map of category access levels
 * @returns True if document should be visible
 */
export const canUserAccessDocument = (
  doc: DocumentFile, 
  userRole: string,
  categoryAccessLevels: Record<string, string> = {}
): boolean => {
  // If no access control, show to everyone
  if (!doc.accessLevel && !categoryAccessLevels[doc.category || '']) return true;
  
  // Get access level, prioritizing document's own setting
  const accessLevel = doc.accessLevel || categoryAccessLevels[doc.category || ''];
  
  // If still no access level, show to everyone
  if (!accessLevel) return true;
  
  // Access level hierarchy: all < homeowner < board < management < admin
  switch(accessLevel) {
    case 'all': 
      return true;
    case 'homeowner': 
      return ['homeowner', 'board', 'management', 'admin'].includes(userRole);
    case 'board': 
      return ['board', 'management', 'admin'].includes(userRole);
    case 'management': 
      return ['management', 'admin'].includes(userRole);
    case 'admin': 
      return ['admin'].includes(userRole);
    default:
      return true;
  }
};
