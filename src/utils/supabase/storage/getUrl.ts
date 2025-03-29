
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
