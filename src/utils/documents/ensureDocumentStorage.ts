
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
    
    // Create the bucket if it doesn't exist
    const { error: createError } = await supabase.storage.createBucket('documents', {
      public: false,
      fileSizeLimit: 100 * 1024 * 1024 // 100MB limit
    });
    
    if (createError) {
      console.error('Error creating documents bucket:', createError);
      return false;
    }
    
    console.log('Documents bucket created successfully');
    return true;
  } catch (error) {
    console.error('Unexpected error ensuring documents bucket exists:', error);
    return false;
  }
};
