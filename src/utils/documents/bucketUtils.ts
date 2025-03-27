
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
      return false;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === 'documents');
    
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
