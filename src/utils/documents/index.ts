
// Export all document utilities
export * from './documentDbUtils';
export * from './documentUtils';

// Export from ensureDocumentStorage.ts
export { ensureDocumentsBucketExists } from './ensureDocumentStorage';

// Export from bucketUtils
export { initializeDocumentsBucket, testBucketAccess } from './bucketUtils';

// Export from uploadUtils but rename the conflicting function
export { 
  getUploadDocumentCategories as getUploadCategories 
} from './uploadUtils';

// Export other functions from uploadUtils
export * from './uploadUtils';

// Export category utility functions
export * from './categoryUtils';
