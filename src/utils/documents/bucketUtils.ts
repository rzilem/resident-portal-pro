
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if the documents bucket exists in Supabase storage
 */
export const checkDocumentsBucketExists = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage.getBucket('documents');
    if (error) {
      console.error('Error checking if documents bucket exists:', error);
      return false;
    }
    return !!data;
  } catch (error) {
    console.error('Exception checking documents bucket:', error);
    return false;
  }
};

/**
 * Create the documents bucket if it doesn't exist
 */
export const createDocumentsBucket = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.storage.createBucket('documents', {
      public: false,
      fileSizeLimit: 52428800, // 50MB
    });
    
    if (error) {
      console.error('Error creating documents bucket:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception creating documents bucket:', error);
    return false;
  }
};

/**
 * Ensure the documents bucket exists (create if needed)
 */
export const ensureDocumentsBucketExists = async (): Promise<boolean> => {
  const exists = await checkDocumentsBucketExists();
  
  if (!exists) {
    return await createDocumentsBucket();
  }
  
  return true;
};

/**
 * Test access to the documents bucket
 */
export const testBucketAccess = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage.from('documents').list();
    
    if (error) {
      console.error('Error testing bucket access:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception testing bucket access:', error);
    return false;
  }
};

/**
 * Initialize document storage
 */
export const initializeDocumentStorage = async (): Promise<{
  bucketExists: boolean;
  bucketAccessible: boolean;
}> => {
  const bucketExists = await ensureDocumentsBucketExists();
  const bucketAccessible = bucketExists ? await testBucketAccess() : false;
  
  return { bucketExists, bucketAccessible };
};
