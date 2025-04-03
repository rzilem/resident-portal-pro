
import { supabase } from '@/integrations/supabase/client';
import { errorLog, infoLog } from '@/utils/debug';

/**
 * Ensures that the documents bucket exists in Supabase Storage
 * @returns True if successful or if the bucket already exists
 */
export const ensureDocumentsBucketExists = async (): Promise<boolean> => {
  try {
    infoLog('Checking if documents bucket exists...');
    
    // Check if documents bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      errorLog('Error listing buckets:', listError);
      // If we can't list buckets, it might be due to permissions but the bucket could still exist
      return false;
    }

    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket) {
      infoLog('Documents bucket does not exist, creating it...');
      
      // Create documents bucket
      const { error: createError } = await supabase.storage.createBucket('documents', {
        public: true, // Make public to ensure easier access for now
        fileSizeLimit: 50 * 1024 * 1024 // 50MB limit
      });
      
      if (createError) {
        errorLog('Error creating documents bucket:', createError);
        
        // Check if it's an RLS error, which might be expected if we don't have admin privileges
        if (createError.message.includes('row-level security') || 
            createError.message.includes('permission denied')) {
          infoLog('Storage bucket creation failed due to permissions, but might exist already.');
          return true; // Assume it exists since we can't confirm
        }
        
        return false;
      }
      
      infoLog('Documents bucket created successfully');
      return true;
    } else {
      infoLog('Documents bucket already exists');
      return true;
    }
  } catch (error) {
    errorLog('Unexpected error ensuring documents bucket exists:', error);
    return false;
  }
};

/**
 * Test if the documents bucket is accessible
 * @returns True if bucket is accessible
 */
export const testBucketAccess = async (): Promise<boolean> => {
  try {
    infoLog('Testing bucket access for documents...');
    
    // Try to list files in the documents bucket
    const { data, error } = await supabase.storage
      .from('documents')
      .list('', { limit: 1 });
    
    if (error) {
      errorLog('Error accessing documents bucket:', error);
      return false;
    }
    
    infoLog('Documents bucket is accessible');
    return true;
  } catch (error) {
    errorLog('Exception testing bucket access:', error);
    return false;
  }
};

/**
 * Check and initialize document storage
 * @returns Object with bucket status and initialization result
 */
export const initializeDocumentStorage = async (): Promise<{
  bucketExists: boolean;
  bucketAccessible: boolean;
}> => {
  // First ensure bucket exists
  const bucketExists = await ensureDocumentsBucketExists();
  
  // Then test access if bucket exists
  const bucketAccessible = bucketExists ? await testBucketAccess() : false;
  
  return {
    bucketExists,
    bucketAccessible
  };
};
