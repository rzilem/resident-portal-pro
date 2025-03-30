
import { ensureDocumentsBucketExists as bucketExists } from './bucketUtils';

/**
 * Ensure that the documents bucket exists in Supabase storage
 * Wrapper function to maintain backward compatibility
 * @returns Promise<boolean> Success indicator
 */
export const ensureDocumentsBucketExists = async (): Promise<boolean> => {
  return await bucketExists();
};
