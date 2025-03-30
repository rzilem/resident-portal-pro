
import { supabase } from '@/integrations/supabase/client';

/**
 * Initialize the documents storage bucket
 * @param forceCreate Force creation even if it exists
 * @returns Promise<boolean> Success status
 */
export const initializeDocumentsBucket = async (forceCreate = false): Promise<boolean> => {
  try {
    console.log('Checking if documents bucket exists...');
    
    // First check if the bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      // Instead of failing, assume bucket might exist but we can't list it
      return await testBucketAccess();
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'documents');
    
    if (bucketExists && !forceCreate) {
      console.log('Documents bucket already exists');
      return true;
    }
    
    if (!bucketExists) {
      console.log('Creating documents bucket...');
      const { error: createError } = await supabase.storage.createBucket('documents', {
        public: false,
        fileSizeLimit: 5242880, // 5MB
      });
      
      if (createError) {
        console.error('Error creating documents bucket:', createError);
        
        // If the error is due to RLS policy, we might still be able to use the bucket
        // This happens when the bucket exists but the user doesn't have permission to create it
        if (createError.message?.includes('row-level security policy')) {
          console.log('RLS policy prevented bucket creation - checking if bucket is usable anyway');
          return await testBucketAccess();
        }
        
        return false;
      }
      
      console.log('Documents bucket created successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error initializing documents bucket:', error);
    return false;
  }
};

/**
 * Test if we can access the documents bucket
 * @returns Promise<boolean> Access status
 */
export const testBucketAccess = async (): Promise<boolean> => {
  try {
    console.log('Testing bucket access...');
    // Try to list files in the bucket as a simple access test
    const { data, error } = await supabase.storage
      .from('documents')
      .list('', { limit: 1 });
    
    if (error) {
      console.error('Bucket access test failed:', error);
      return false;
    }
    
    console.log('Bucket access test successful');
    return true;
  } catch (error) {
    console.error('Unexpected error testing bucket access:', error);
    return false;
  }
};

/**
 * Ensure that the documents bucket exists, creating it if necessary
 * @param forceCreate Force creation even if it exists
 * @returns Promise<boolean> Success status
 */
export const ensureDocumentsBucketExists = async (forceCreate = false): Promise<boolean> => {
  // First try to test if we can already access the bucket
  const canAccess = await testBucketAccess();
  if (canAccess) {
    console.log('Documents bucket is already accessible');
    return true;
  }
  
  // If we can't access it, try to create it
  return await initializeDocumentsBucket(forceCreate);
};
