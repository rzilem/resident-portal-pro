
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if the documents bucket exists
 * @returns Promise that resolves to a boolean indicating if bucket exists
 */
export const ensureDocumentsBucketExists = async (): Promise<boolean> => {
  try {
    // First, check if the bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      return false;
    }
    
    // Check if documents bucket exists
    const documentsBucket = buckets.find(bucket => bucket.name === 'documents');
    
    if (documentsBucket) {
      console.log('Documents bucket exists');
      return true;
    }
    
    // If it doesn't exist, create it
    try {
      const { data, error: createError } = await supabase.storage.createBucket('documents', {
        public: true // Make it publicly accessible
      });
      
      if (createError) {
        console.error('Error creating documents bucket:', createError);
        return false;
      }
      
      console.log('Created documents bucket:', data);
      return true;
    } catch (createErr) {
      console.error('Exception creating bucket:', createErr);
      return false;
    }
  } catch (err) {
    console.error('Unexpected error in ensureDocumentsBucketExists:', err);
    return false;
  }
};

/**
 * Tests if the user has access to the documents bucket
 * @returns Promise that resolves to a boolean
 */
export const testBucketAccess = async (): Promise<boolean> => {
  try {
    // Attempt to list files in the bucket
    const { data, error } = await supabase.storage
      .from('documents')
      .list('test', {
        limit: 1
      });
    
    // Even if there are no files, if there's no error, we have access
    return !error;
  } catch (err) {
    console.error('Error testing bucket access:', err);
    return false;
  }
};

/**
 * Initialize document storage
 * @returns Promise that resolves to a boolean
 */
export const initializeDocumentStorage = async (): Promise<boolean> => {
  try {
    const bucketExists = await ensureDocumentsBucketExists();
    if (!bucketExists) {
      return false;
    }
    
    // Test access to the bucket
    const hasAccess = await testBucketAccess();
    return hasAccess;
  } catch (err) {
    console.error('Error initializing document storage:', err);
    return false;
  }
};
