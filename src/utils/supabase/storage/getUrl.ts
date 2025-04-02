
import { supabase } from "@/integrations/supabase/client";
import { debugLog, errorLog } from "@/utils/debug";

/**
 * Get the public URL for a file in a storage bucket
 * @param bucket The storage bucket name
 * @param path Path to the file within the bucket
 * @returns Public URL of the file
 */
export const getFileUrl = (bucket: string, path: string): string => {
  try {
    // Add cache busting parameter to prevent stale image caching
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(`${path}?t=${Date.now()}`);
    
    debugLog(`Generated URL for ${path} in bucket ${bucket}`, data.publicUrl);
    return data.publicUrl;
  } catch (error) {
    errorLog(`Error generating URL for path: ${path} in bucket: ${bucket}`, error);
    return '';
  }
};

/**
 * Check if a file exists in a storage bucket
 * @param bucket The storage bucket name
 * @param path Path to the file within the bucket
 * @returns True if the file exists, false otherwise
 */
export const checkFileExists = async (bucket: string, path: string): Promise<boolean> => {
  try {
    // Check if bucket exists first
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      errorLog('Error checking buckets:', bucketsError);
      return false;
    }
    
    const bucketExists = buckets.some(b => b.name === bucket);
    if (!bucketExists) {
      debugLog(`Bucket ${bucket} does not exist, returning false`);
      return false;
    }
    
    // Now check if file exists
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path.split('/').slice(0, -1).join('/') || '');
    
    if (error) {
      errorLog(`Error listing files in bucket: ${bucket}`, error);
      return false;
    }
    
    const fileName = path.split('/').pop() || '';
    return data.some(item => item.name === fileName);
  } catch (error) {
    errorLog(`Error checking if file exists: ${path} in bucket: ${bucket}`, error);
    return false;
  }
};
