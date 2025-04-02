
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
    debugLog(`Generating URL for ${path} in ${bucket}`);
    
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    if (!data || !data.publicUrl) {
      errorLog(`Failed to generate public URL for ${path}`);
      return '';
    }
    
    debugLog(`Generated URL: ${data.publicUrl}`);
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
    debugLog(`Checking if file exists: ${path} in ${bucket}`);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);
    
    const exists = !!data && !error;
    debugLog(`File ${path} exists: ${exists}`);
    
    return exists;
  } catch (error) {
    errorLog(`Error checking if file exists: ${path} in bucket: ${bucket}`, error);
    return false;
  }
};
