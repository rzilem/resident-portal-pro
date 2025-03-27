
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { isDemoAuthenticated } from '@/utils/auth/demoAuth';

/**
 * Check if a bucket exists and create it if it doesn't
 */
export const ensureBucketExists = async (bucketName: string): Promise<boolean> => {
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
    
    if (!bucketExists) {
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
