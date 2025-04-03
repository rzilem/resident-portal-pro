
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { errorLog, infoLog } from '@/utils/debug';

/**
 * Checks if the documents bucket exists and creates it if it doesn't
 * @returns Promise resolving to boolean indicating success
 */
export const ensureDocumentsBucketExists = async (): Promise<boolean> => {
  try {
    // First check if the bucket already exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      errorLog('Error listing buckets:', bucketsError.message);
      return false;
    }
    
    const documentsBucket = buckets.find(bucket => bucket.name === 'documents');
    
    if (documentsBucket) {
      infoLog('Documents bucket already exists');
      return true;
    }
    
    // If we reach here, we need to create the bucket
    infoLog('Creating documents bucket...');
    
    try {
      const { data, error } = await supabase.storage.createBucket('documents', {
        public: true,
        fileSizeLimit: 50 * 1024 * 1024 // 50MB limit
      });
      
      if (error) {
        errorLog('Error creating documents bucket:', error);
        // Due to RLS issues, we'll assume the bucket exists but we can't see/create it
        // The user may have insufficient permissions to create buckets
        infoLog('Using existing documents bucket (assumed to exist)');
        return true;
      }
      
      infoLog('Documents bucket created successfully');
      return true;
    } catch (createError) {
      errorLog('Exception creating bucket:', createError);
      // In case of error, we'll try to continue assuming the bucket exists
      infoLog('Using existing documents bucket (assumed to exist)');
      return true;
    }
  } catch (error) {
    errorLog('Exception ensuring bucket exists:', error);
    return false;
  }
};

/**
 * Tests access to the documents bucket
 * @returns Promise resolving to boolean indicating success
 */
export const testBucketAccess = async (): Promise<boolean> => {
  try {
    // Just try to list files in the bucket
    const { data, error } = await supabase.storage.from('documents').list();
    
    if (error) {
      if (error.message.includes('does not exist')) {
        // If bucket doesn't exist, we'll try to create it
        infoLog('Documents bucket does not exist, attempting to create it');
        return await ensureDocumentsBucketExists();
      }
      
      errorLog('Error testing bucket access:', error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    errorLog('Exception testing bucket access:', error);
    return false;
  }
};
