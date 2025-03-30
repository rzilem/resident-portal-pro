
// Export all document utilities
export * from './documentDbUtils';
export * from './documentUtils';

// Export from bucketUtils directly
export { initializeDocumentsBucket, testBucketAccess, ensureDocumentsBucketExists } from './bucketUtils';

// Export from uploadUtils
export { 
  getUploadDocumentCategories 
} from './uploadUtils';

// Export other functions from uploadUtils
export * from './uploadUtils';

// Export category utility functions
export * from './categoryUtils';

// Export search utility functions
export * from './searchUtils';

// Re-export document icon utilities for backwards compatibility
export { getFileIcon, getDocumentIcon, formatDate, formatFileSize } from '@/components/documents/utils/documentIconUtils';
