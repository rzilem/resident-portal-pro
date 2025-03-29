
import { supabase } from "@/integrations/supabase/client";

/**
 * Get the public URL for a file in a bucket
 * @param bucket The bucket name
 * @param path Path to the file within the bucket
 * @returns Public URL of the file
 */
export const getFileUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

/**
 * Check if a file exists in a bucket
 * @param bucket The bucket name
 * @param path Path to the file within the bucket
 * @returns Boolean indicating if the file exists
 */
export const checkFileExists = async (bucket: string, path: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage.from(bucket).download(path);
    return !error && !!data;
  } catch (error) {
    console.error("Error checking if file exists:", error);
    return false;
  }
};
