
import { supabase } from '@/integrations/supabase/client';

/**
 * Test if we can access the documents bucket
 * @returns Promise resolving to boolean indicating bucket access
 */
export const testBucketAccess = async (): Promise<boolean> => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error accessing buckets:', error.message);
      return false;
    }
    
    // Check if the documents bucket exists
    const documentsBucket = buckets.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket) {
      console.warn('Documents bucket not found');
      // Try to create it
      const created = await ensureDocumentsBucketExists();
      return created;
    }
    
    // Try to list files in the bucket to test access
    const { data, error: listError } = await supabase.storage
      .from('documents')
      .list();
    
    if (listError) {
      console.error('Error listing files in documents bucket:', listError.message);
      return false;
    }
    
    console.log('Document storage is accessible');
    return true;
  } catch (error) {
    console.error('Exception testing bucket access:', error);
    return false;
  }
};

/**
 * Ensure that the documents bucket exists, creating it if needed
 * @returns Promise resolving to boolean indicating if bucket exists
 */
export const ensureDocumentsBucketExists = async (): Promise<boolean> => {
  try {
    // First check if the bucket already exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError.message);
      return false;
    }
    
    const documentsBucket = buckets.find(bucket => bucket.name === 'documents');
    
    if (documentsBucket) {
      console.log('Documents bucket already exists');
      return true;
    }
    
    // If we reach here, we need to create the bucket
    console.log('Creating documents bucket...');
    
    const { data, error } = await supabase.storage.createBucket('documents', {
      public: true,
      fileSizeLimit: 50 * 1024 * 1024 // 50MB limit
    });
    
    if (error) {
      console.error('Error creating documents bucket:', error.message);
      return false;
    }
    
    console.log('Documents bucket created successfully');
    return true;
  } catch (error) {
    console.error('Exception ensuring bucket exists:', error);
    return false;
  }
};
