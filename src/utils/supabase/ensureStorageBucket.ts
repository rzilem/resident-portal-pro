
import { supabase } from '@/integrations/supabase/client';

/**
 * Ensures that a storage bucket exists, creating it if necessary
 * @param bucketName The name of the bucket to ensure exists
 * @param isPublic Whether the bucket should be public
 */
export const ensureStorageBucket = async (
  bucketName: string, 
  isPublic: boolean = false
): Promise<boolean> => {
  try {
    // First check if the bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      return false;
    }
    
    // Check if our bucket exists
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    if (bucketExists) {
      console.log(`Bucket ${bucketName} already exists`);
      return true;
    }
    
    // Create the bucket if it doesn't exist
    const { error: createError } = await supabase.storage.createBucket(
      bucketName, 
      { public: isPublic }
    );
    
    if (createError) {
      console.error(`Error creating bucket ${bucketName}:`, createError);
      return false;
    }
    
    console.log(`Successfully created bucket ${bucketName}`);
    return true;
  } catch (error) {
    console.error('Unexpected error in ensureStorageBucket:', error);
    return false;
  }
};
