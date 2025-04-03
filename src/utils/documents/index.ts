
// Export all document utilities
export * from './documentDbUtils';
// Re-export specific functions from documentUtils to avoid naming conflicts
export {
  formatDate,
  formatFileSize,
  getFileTypeInfo,
  isPreviewable,
  sanitizeDocumentUrl,
  canUseOfficeViewer,
  getDocumentCategories,
  ensureDocumentsBucketExists,
  // Only export getDocumentById once
  getDocumentById
} from './documentUtils';

export * from './authUtils';
export * from './bucketUtils';
// Re-export specific function from uploadUtils to avoid naming conflicts
import { getDocumentCategories as getDocumentCategoriesFromUpload } from './uploadUtils';
export { getDocumentCategoriesFromUpload };

// Removed duplicate re-export of getDocumentById
