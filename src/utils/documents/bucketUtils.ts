
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { isDemoAuthenticated } from '@/utils/auth/demoAuth';

/**
 * Check if a bucket exists and create it if it doesn't
 */
export const ensureBucketExists = async (bucketName: string, forceCreate: boolean = false): Promise<boolean> => {
  try {
    // For demo user, just pretend the bucket exists to avoid Supabase auth issues
    if (isDemoAuthenticated()) {
      console.log(`[Demo mode] Simulating bucket check for: ${bucketName}`);
      return true;
    }

    // Check if bucket exists
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error checking buckets:', listError);
      throw listError;
    }
    
    const bucketExists = existingBuckets.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists || forceCreate) {
      console.log(`Bucket ${bucketName} does not exist, creating it...`);
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 52428800, // 50MB
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        throw createError;
      }
      
      console.log(`Bucket ${bucketName} created successfully`);
    } else {
      console.log(`Bucket ${bucketName} already exists`);
    }
    
    return true;
  } catch (error) {
    console.error('Error in ensureBucketExists:', error);
    toast.error(`Failed to ensure bucket exists: ${bucketName}`);
    return false;
  }
};

/**
 * Ensure the documents bucket exists
 * @param {boolean} forceCreate - Force creation of bucket even if it exists
 * @returns {Promise<boolean>} Success status
 */
export const ensureDocumentsBucketExists = async (forceCreate: boolean = false): Promise<boolean> => {
  return ensureBucketExists('documents', forceCreate);
};

/**
 * Test if we can access a bucket by trying to list files
 */
export const testBucketAccess = async (): Promise<boolean> => {
  try {
    // For demo user, just pretend the bucket is accessible
    if (isDemoAuthenticated()) {
      console.log('[Demo mode] Simulating bucket access test: SUCCESS');
      return true;
    }

    // Try to list files in the bucket (we don't care about the results, just if it succeeds)
    const { data, error } = await supabase.storage
      .from('documents')
      .list('', { limit: 1 });
    
    if (error) {
      console.error('Error accessing bucket:', error);
      return false;
    }
    
    console.log('Successfully accessed bucket');
    return true;
  } catch (error) {
    console.error('Error testing bucket access:', error);
    return false;
  }
};
