import { supabase } from "@/integrations/supabase/client";

/**
 * Initialize the documents bucket if it doesn’t exist
 * @returns True if the bucket is ready, false otherwise
 */
export const initializeDocumentsBucket = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error("Error listing buckets:", error.message);
      return false;
    }
    if (data.some(bucket => bucket.name === 'documents')) {
      console.log("Documents bucket already exists");
      return true;
    }

    const { error: createError } = await supabase.storage.createBucket('documents', {
      public: false, // Private bucket for authenticated access
    });
    if (createError) {
      console.error("Error creating bucket:", createError.message);
      return false;
    }
    console.log("Documents bucket created");
    return true;
  } catch (error: unknown) {
    console.error("Unexpected error:", error);
    return false;
  }
};
