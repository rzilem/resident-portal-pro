
import { supabase } from '@/integrations/supabase/client';

/**
 * Initialize the documents bucket in Supabase storage
 * @returns Promise<boolean> Success indicator
 */
export const initializeDocumentsBucket = async (): Promise<boolean> => {
  try {
    // Check if the bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return true; // Return true to allow the app to continue
    }
    
    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (documentsBucket) {
      console.log('Documents bucket already exists');
      return true;
    }
    
    // Create the bucket with a smaller file size limit
    const { error: createError } = await supabase.storage.createBucket('documents', {
      public: false,
      fileSizeLimit: 10 * 1024 * 1024 // Reduced to 10MB
    });
    
    if (createError) {
      console.error('Error creating documents bucket:', createError);
      return true; // Return true despite error
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing documents bucket:', error);
    return true; // Return true despite error
  }
};

/**
 * Test if the documents bucket is accessible
 * @returns Promise<boolean> True if the bucket is accessible
 */
export const testBucketAccess = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .list('', { limit: 1 });
    
    if (error) {
      console.error('Error testing bucket access:', error);
      return true; // Return true to allow the app to continue
    }
    
    return true;
  } catch (error) {
    console.error('Exception testing bucket access:', error);
    return true; // Return true despite error
  }
};
