
import { supabase } from "@/integrations/supabase/client";

/**
 * Ensure the documents bucket exists
 * @param forceCreate Force creation of the bucket even if it doesn't exist
 * @returns True if the bucket exists or was created, false otherwise
 */
export const ensureDocumentsBucketExists = async (forceCreate = false): Promise<boolean> => {
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

    if (!forceCreate) {
      console.log("Documents bucket doesn't exist and forceCreate is false");
      return false;
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

/**
 * Test access to the documents bucket
 * @returns True if the bucket is accessible, false otherwise
 */
export const testBucketAccess = async (): Promise<boolean> => {
  try {
    // Try to list the root directory
    const { data, error } = await supabase.storage
      .from('documents')
      .list();
    
    if (error) {
      console.error("Error accessing bucket:", error.message);
      return false;
    }
    
    console.log("Bucket access test successful");
    return true;
  } catch (error: unknown) {
    console.error("Unexpected error testing bucket access:", error);
    return false;
  }
};

/**
 * Initialize the documents bucket if it doesn't exist
 * @returns True if the bucket is ready, false otherwise
 */
export const initializeDocumentsBucket = async (): Promise<boolean> => {
  try {
    console.log('Initializing document storage...');
    
    // Create/ensure bucket exists
    const bucketExists = await ensureDocumentsBucketExists();
    if (!bucketExists) {
      console.error('Failed to initialize document bucket');
      return false;
    }
    
    // Test bucket access
    const canAccess = await testBucketAccess();
    if (!canAccess) {
      console.error('Document bucket exists but is not accessible');
      return false;
    }
    
    console.log('Document storage initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing document bucket:', error);
    return false;
  }
};
