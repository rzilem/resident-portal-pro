
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
