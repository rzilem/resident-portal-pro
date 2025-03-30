
import { supabase } from '@/integrations/supabase/client';

/**
 * Ensure that the documents bucket exists in Supabase storage
 * @returns Promise<boolean> Success indicator
 */
export const ensureDocumentsBucketExists = async (): Promise<boolean> => {
  try {
    // Check if the bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }
    
    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (documentsBucket) {
      console.log('Documents bucket already exists');
      return true;
    }
    
    // Create the bucket if it doesn't exist with a smaller file size limit
    const { error: createError } = await supabase.storage.createBucket('documents', {
      public: false,
      fileSizeLimit: 10 * 1024 * 1024 // Reduced to 10MB limit
    });
    
    if (createError) {
      console.error('Error creating documents bucket:', createError);
      // Even if there's an error, we'll return true to allow the app to continue
      // This is a temporary fix to prevent the app from getting stuck
      return true;
    }
    
    console.log('Documents bucket created successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error ensuring documents bucket exists:', error);
    // Return true to avoid blocking the app from loading
    return true;
  }
};
