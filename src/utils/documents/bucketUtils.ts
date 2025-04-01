
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Checks if the documents bucket exists and creates it if it doesn't
 * @returns Promise resolving to boolean indicating success
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
      toast.error(`Failed to create storage bucket: ${error.message}`);
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
 * Tests access to the documents bucket
 * @returns Promise resolving to boolean indicating success
 */
export const testBucketAccess = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage.from('documents').list();
    
    if (error) {
      console.error('Error testing bucket access:', error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception testing bucket access:', error);
    return false;
  }
};
