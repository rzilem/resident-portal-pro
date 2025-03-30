
// Export all document utilities
export * from './documentDbUtils';
export * from './documentUtils';

// Export from ensureDocumentStorage.ts
export { ensureDocumentsBucketExists } from './ensureDocumentStorage';

// Export from bucketUtils
export { initializeDocumentsBucket, testBucketAccess } from './bucketUtils';

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
