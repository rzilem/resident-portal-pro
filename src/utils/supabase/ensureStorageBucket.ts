
import { supabase } from "@/integrations/supabase/client";
import { errorLog } from "@/utils/debug";

/**
 * Creates a storage bucket if it doesn't exist
 * @param bucketName Name of the bucket to create
 * @param isPublic Whether the bucket should be publicly accessible
 * @returns True if bucket exists or was created successfully, false otherwise
 */
export const ensureStorageBucket = async (
  bucketName: string,
  isPublic: boolean = false
): Promise<boolean> => {
  try {
    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error checking buckets:', listError);
      return false;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
        fileSizeLimit: 2097152, // 2MB in bytes
      });
      
      if (createError) {
        console.error(`Error creating bucket ${bucketName}:`, createError);
        return false;
      }
      
      console.log(`Bucket ${bucketName} created successfully with public access: ${isPublic}`);
    } else {
      console.log(`Bucket ${bucketName} already exists`);
    }
    
    return true;
  } catch (error) {
    errorLog('Exception in ensureStorageBucket:', error);
    return false;
  }
};
