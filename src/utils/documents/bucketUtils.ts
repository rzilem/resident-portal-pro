
/**
 * Utility functions for Supabase storage bucket operations
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Ensure a bucket exists in Supabase storage
 * @param bucketId - Bucket ID
 * @param forceCreation - Force creation even if bucket might exist
 * @returns Boolean indicating if the bucket exists or was created
 */
export const ensureBucketExists = async (
  bucketId: string,
  forceCreation: boolean = false
): Promise<boolean> => {
  try {
    // Check if bucket exists
    if (!forceCreation) {
      const { data: buckets, error: getBucketsError } = await supabase.storage.listBuckets();
      
      if (getBucketsError) {
        console.error('Error checking buckets:', getBucketsError);
        return false;
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === bucketId);
      if (bucketExists) {
        console.log(`Bucket ${bucketId} already exists`);
        return true;
      }
    }
    
    // Create the bucket if it doesn't exist
    const { data, error } = await supabase.storage.createBucket(bucketId, {
      public: true
    });
    
    if (error) {
      console.error(`Error creating bucket ${bucketId}:`, error);
      return false;
    }
    
    console.log(`Bucket ${bucketId} created successfully`);
    return true;
  } catch (error) {
    console.error('Unexpected error in ensureBucketExists:', error);
    return false;
  }
};

/**
 * Ensure the documents bucket exists in Supabase storage
 * @param forceCreation - Force creation even if bucket might exist
 * @returns Boolean indicating if the bucket exists or was created
 */
export const ensureDocumentsBucketExists = async (
  forceCreation: boolean = false
): Promise<boolean> => {
  console.log('Initializing document storage...');
  const result = await ensureBucketExists('documents', forceCreation);
  
  if (!result) {
    console.error('Failed to initialize document storage');
    toast.error('Document storage initialization failed. Some features may not work properly.');
  }
  
  return result;
};

/**
 * Test if we can access the bucket (read/write)
 * @returns Boolean indicating if bucket access is working
 */
export const testBucketAccess = async (): Promise<boolean> => {
  try {
    const testFile = new Blob(['test'], { type: 'text/plain' });
    const testPath = `test-${Date.now()}.txt`;
    
    // Try to upload a test file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(testPath, testFile);
    
    if (uploadError) {
      console.error('Test upload failed:', uploadError);
      return false;
    }
    
    // Try to delete the test file
    const { error: deleteError } = await supabase.storage
      .from('documents')
      .remove([testPath]);
    
    if (deleteError) {
      console.error('Test delete failed:', deleteError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Bucket access test error:', error);
    return false;
  }
};
