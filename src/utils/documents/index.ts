
/**
 * Central export file for document utilities
 */

// Export individual utilities
export * from './authUtils';
export * from './categoryUtils';
export * from './documentUtils';
export * from './documentDbUtils';
export * from './policyUtils';
export * from './storageUtils';

// Export fileUtils separately to avoid duplicate exports
import { 
  formatFileSize, 
  formatDate, 
  validateFileType,
  validateFileSize,
  downloadFile as downloadDocumentFile
} from './fileUtils';

export { 
  formatFileSize, 
  formatDate, 
  validateFileType,
  validateFileSize,
  downloadDocumentFile
};

// Export bucketUtils separately to avoid duplicate exports
import { 
  ensureBucketExists, 
  ensureDocumentsBucketExists, 
  testBucketAccess 
} from './bucketUtils';

export { 
  ensureBucketExists, 
  ensureDocumentsBucketExists, 
  testBucketAccess 
};

// Export uploadUtils separately
import {
  uploadDocument,
  getDownloadUrl,
  deleteStorageFile
} from './uploadUtils';

export {
  uploadDocument,
  getDownloadUrl,
  deleteStorageFile
};
