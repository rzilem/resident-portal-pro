
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Test access to a storage bucket
 * @returns Promise resolving to a boolean indicating if access is available
 */
export const testBucketAccess = async (): Promise<boolean> => {
  try {
    // Try to list files (with a limit of 1) to test permissions
    const { error } = await supabase.storage
      .from('documents')
      .list('', { limit: 1 });
    
    if (error) {
      console.error('Error accessing storage bucket:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception testing bucket access:', error);
    return false;
  }
};

/**
 * Ensures that the documents bucket exists in Supabase Storage
 * @param force Force bucket creation attempt even if initial check fails (admin only)
 * @returns True if successful, false otherwise
 */
export const ensureDocumentsBucketExists = async (force: boolean = false): Promise<boolean> => {
  try {
    // Check if documents bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      
      if (!force) return false;
      
      // If force is true, we'll still try to create the bucket even after list error
      console.log('Forcing bucket creation attempt despite list error...');
    }

    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket) {
      console.log('Documents bucket does not exist, creating it...');
      // Create documents bucket
      const { error: createError } = await supabase.storage.createBucket('documents', {
        public: false,
        fileSizeLimit: 50 * 1024 * 1024, // 50MB limit
      });
      
      if (createError) {
        // Check if it's an RLS error, which might be expected if we don't have admin privileges
        if (createError.message.includes('row-level security')) {
          console.log('Storage bucket creation failed due to RLS, but this may be expected. Will proceed as if bucket exists.');
          return true;
        }
        
        console.error('Error creating documents bucket:', createError);
        return false;
      }
      
      console.log('Documents bucket created successfully');
    } else {
      console.log('Documents bucket already exists');
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error ensuring documents bucket exists:', error);
    return false;
  }
};

/**
 * Initialize document storage by ensuring the bucket exists
 * @returns Promise resolving to boolean indicating success
 */
export const initializeDocumentsBucket = async (): Promise<boolean> => {
  try {
    // First check if bucket already exists by attempting to list files
    const { error: listError } = await supabase.storage
      .from('documents')
      .list('', { limit: 1 });
    
    // If no error, bucket exists and we can access it
    if (!listError) {
      console.log('Documents bucket exists and is accessible');
      return true;
    }
    
    // If error is not about bucket not existing, return false
    if (listError && !listError.message.includes('does not exist')) {
      console.error('Error accessing documents bucket:', listError);
      return false;
    }
    
    // Attempt to create the bucket
    console.log('Documents bucket does not exist, creating it...');
    
    // For security reasons, only admin should create buckets
    // This would typically be handled server-side with admin privileges
    // Here's a simplified approach for demonstration purposes
    toast.error('Document storage not properly configured. Please contact an administrator.');
    return false;
    
  } catch (error) {
    console.error('Exception initializing documents bucket:', error);
    toast.error('Failed to initialize document storage');
    return false;
  }
};

/**
 * Ensure a folder exists in a bucket
 * @param bucketName The name of the bucket
 * @param folderPath The path of the folder to ensure
 * @returns Promise resolving to boolean indicating if folder exists/was created
 */
export const ensureFolderExists = async (
  bucketName: string,
  folderPath: string
): Promise<boolean> => {
  try {
    // Make sure folder path ends with a slash
    const normalizedPath = folderPath.endsWith('/') ? folderPath : `${folderPath}/`;
    
    // First check if folder already exists
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(normalizedPath);
    
    if (!error) {
      console.log(`Folder ${normalizedPath} already exists`);
      return true;
    }
    
    // Create an empty file to represent the folder
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(`${normalizedPath}.folder`, new Blob([]));
    
    if (uploadError) {
      console.error(`Error creating folder ${normalizedPath}:`, uploadError);
      return false;
    }
    
    console.log(`Created folder ${normalizedPath} successfully`);
    return true;
  } catch (error) {
    console.error('Exception in ensureFolderExists:', error);
    return false;
  }
};
