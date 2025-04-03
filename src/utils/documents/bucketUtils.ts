
import { supabase } from '@/integrations/supabase/client';
import { errorLog, infoLog } from '@/utils/debug';

/**
 * Ensures the documents bucket exists in Supabase storage
 * @returns boolean indicating if the bucket exists or was created successfully
 */
export const ensureDocumentsBucketExists = async (): Promise<boolean> => {
  try {
    // Check if the bucket already exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      errorLog('Error checking storage buckets:', bucketsError);
      return false;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === 'documents');
    
    if (bucketExists) {
      infoLog('Documents bucket already exists');
      return true;
    }
    
    // Create the bucket if it doesn't exist
    infoLog('Creating documents bucket');
    const { error: createError } = await supabase.storage.createBucket('documents', {
      public: true,
      fileSizeLimit: 50 * 1024 * 1024, // 50MB limit
      allowedMimeTypes: ['application/*', 'image/*', 'text/*']
    });
    
    if (createError) {
      errorLog('Error creating documents bucket:', createError);
      return false;
    }
    
    infoLog('Documents bucket created successfully');
    return true;
  } catch (error) {
    errorLog('Unexpected error ensuring documents bucket exists:', error);
    return false;
  }
};

/**
 * Tests access to the documents bucket
 * @returns boolean indicating if the bucket is accessible
 */
export const testBucketAccess = async (): Promise<boolean> => {
  try {
    // Attempt to list files in the bucket
    const { error } = await supabase.storage
      .from('documents')
      .list();
    
    if (error) {
      errorLog('Error accessing documents bucket:', error);
      return false;
    }
    
    infoLog('Documents bucket is accessible');
    return true;
  } catch (error) {
    errorLog('Unexpected error testing bucket access:', error);
    return false;
  }
};
