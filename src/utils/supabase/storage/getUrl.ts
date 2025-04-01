
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
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    debugLog(`Generated URL for ${path} in ${bucket}: ${data.publicUrl}`);
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
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);
    
    return !!data && !error;
  } catch (error) {
    errorLog(`Error checking if file exists: ${path} in bucket: ${bucket}`, error);
    return false;
  }
};
