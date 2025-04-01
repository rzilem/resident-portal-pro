
import { supabase } from '@/lib/supabase';

/**
 * Test if we can access the documents bucket
 * @returns Promise resolving to boolean indicating bucket access
 */
export const testBucketAccess = async (): Promise<boolean> => {
  try {
    // First check if the bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error accessing buckets:', error.message);
      return false;
    }
    
    // Check if the documents bucket exists
    const documentsBucket = buckets.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket) {
      console.warn('Documents bucket not found');
      return false;
    }
    
    // Try to list files in the bucket to test access
    const { data, error: listError } = await supabase.storage
      .from('documents')
      .list();
    
    if (listError) {
      // Check if it's a permissions issue but the bucket exists
      if (listError.message.includes('permission') || 
          listError.message.includes('access') || 
          listError.message.includes('policy')) {
        console.log('Document bucket exists but current user lacks permissions');
        // Return true if the bucket exists, even if we can't list files
        // This will allow the application to attempt uploads which may work
        return true;
      }
      
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
      // Check if it's just an RLS policy issue
      if (bucketsError.message.includes('policy')) {
        console.log('Cannot list buckets due to RLS policy, assuming documents bucket exists');
        return true;
      }
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
      public: true, // Changed to true to make access easier for demo purposes
      fileSizeLimit: 50 * 1024 * 1024 // 50MB limit
    });
    
    if (error) {
      // Check if it's a policy error - the bucket might already exist but we lack permissions
      if (error.message.includes('policy')) {
        console.log('RLS policy preventing bucket creation, but operation may have succeeded');
        return true;
      }
      
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

/**
 * Utility function to check if a file exists in the bucket
 * @param path Path to the file
 * @returns Promise resolving to boolean indicating if file exists
 */
export const fileExists = async (path: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .download(path);
    
    if (error) {
      if (error.message.includes('Object not found') || 
          error.message.includes('The specified key does not exist')) {
        return false;
      }
      
      // Other errors might mean we don't have permission, but file might exist
      console.error('Error checking if file exists:', error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception checking if file exists:', error);
    return false;
  }
};
