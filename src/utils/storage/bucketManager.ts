
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Enum for storage bucket names
 */
export enum StorageBucket {
  DOCUMENTS = 'documents',
  ASSOCIATION_PHOTOS = 'association_photos',
  ASSOCIATION_FILES = 'association_files',
}

/**
 * Check if a bucket exists in Supabase storage
 * @param bucketName The bucket name to check
 * @returns Promise resolving to true if bucket exists
 */
export const checkBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error(`Error checking if bucket ${bucketName} exists:`, error);
      return false;
    }
    
    return buckets?.some(bucket => bucket.name === bucketName) || false;
  } catch (error) {
    console.error(`Exception checking if bucket ${bucketName} exists:`, error);
    return false;
  }
};

/**
 * Create a bucket in Supabase storage if it doesn't exist
 * @param bucketName The bucket name to create
 * @param isPublic Whether the bucket should be public
 * @returns Promise resolving to true if creation succeeded or bucket already exists
 */
export const ensureBucketExists = async (
  bucketName: string,
  isPublic: boolean = true
): Promise<boolean> => {
  try {
    // Check if bucket already exists
    const exists = await checkBucketExists(bucketName);
    if (exists) {
      console.log(`Bucket ${bucketName} already exists`);
      return true;
    }
    
    console.log(`Creating bucket ${bucketName}...`);
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: isPublic,
      fileSizeLimit: 50 * 1024 * 1024, // 50MB limit
    });
    
    if (error) {
      // If we get an RLS error, the bucket may exist but the user doesn't have permission
      if (error.message.includes('row-level security')) {
        console.log(`RLS error creating bucket ${bucketName}, it may already exist`);
        return true;
      }
      
      console.error(`Error creating bucket ${bucketName}:`, error);
      return false;
    }
    
    console.log(`Successfully created bucket ${bucketName}`);
    return true;
  } catch (error) {
    console.error(`Exception ensuring bucket ${bucketName} exists:`, error);
    return false;
  }
};

/**
 * Initialize all required storage buckets
 * This should be called during application startup
 */
export const initializeStorageBuckets = async (): Promise<void> => {
  try {
    // Try to create all required buckets
    const results = await Promise.allSettled([
      ensureBucketExists(StorageBucket.DOCUMENTS),
      ensureBucketExists(StorageBucket.ASSOCIATION_PHOTOS),
      ensureBucketExists(StorageBucket.ASSOCIATION_FILES),
    ]);
    
    // Log results
    results.forEach((result, index) => {
      const bucketName = Object.values(StorageBucket)[index];
      if (result.status === 'fulfilled') {
        if (result.value) {
          console.log(`✅ Bucket ${bucketName} is available`);
        } else {
          console.warn(`⚠️ Failed to create bucket ${bucketName}`);
        }
      } else {
        console.error(`❌ Error ensuring bucket ${bucketName} exists:`, result.reason);
      }
    });
  } catch (error) {
    console.error('Error initializing storage buckets:', error);
  }
};

/**
 * Get a file URL from a bucket
 * @param bucketName The bucket name
 * @param path The file path
 * @returns The public URL of the file
 */
export const getFileUrl = (bucketName: string, path: string): string => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
  return data.publicUrl;
};
