
/**
 * Utilities for managing storage policies
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isUsingDemoCredentials } from './authUtils';

/**
 * Log instructions to manually set storage policies in Supabase dashboard
 * @param {string} bucketName - Bucket name
 * @returns {Promise<void>}
 */
export const ensureStoragePolicies = async (bucketName: string = 'documents'): Promise<void> => {
  console.log(`Storage bucket '${bucketName}' needs the following policies in Supabase Dashboard > Storage > Policies > ${bucketName}:`);
  console.log(`
    CREATE POLICY "Allow authenticated uploads" ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = '${bucketName}' AND auth.uid() IS NOT NULL);

    CREATE POLICY "Allow authenticated reads" ON storage.objects
    FOR SELECT
    TO authenticated
    WITH CHECK (bucket_id = '${bucketName}' AND auth.uid() IS NOT NULL);
    
    CREATE POLICY "Allow public reads for public assets" ON storage.objects
    FOR SELECT
    TO authenticated, anon
    WITH CHECK (bucket_id = '${bucketName}' AND is_public = true);
    
    CREATE POLICY "Allow authenticated updates" ON storage.objects
    FOR UPDATE
    TO authenticated
    WITH CHECK (bucket_id = '${bucketName}' AND auth.uid() = owner);
    
    CREATE POLICY "Allow authenticated deletions" ON storage.objects
    FOR DELETE
    TO authenticated
    WITH CHECK (bucket_id = '${bucketName}' AND auth.uid() = owner);
  `);
  
  toast.info("Ensure correct storage policies are configured in Supabase", {
    duration: 5000,
    id: "storage-policy-reminder",
  });
};

/**
 * Check if a bucket exists in storage
 * @param {string} bucketName - Bucket name to check
 * @returns {Promise<boolean>} True if exists
 */
export const checkBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    // Special handling for demo user
    const isDemoUser = await isUsingDemoCredentials();
    if (isDemoUser) {
      console.log(`Demo user - simulating bucket ${bucketName} exists`);
      return true;
    }
    
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
 * Create a bucket in storage
 * @param {string} bucketName - Bucket name to create
 * @param {boolean} isPublic - Whether bucket should be public
 * @param {number} fileSizeLimit - Max file size in bytes
 * @returns {Promise<boolean>} True if created or already exists
 */
export const createBucket = async (
  bucketName: string,
  isPublic: boolean = false,
  fileSizeLimit: number = 10485760
): Promise<boolean> => {
  try {
    // Special handling for demo user
    const isDemoUser = await isUsingDemoCredentials();
    if (isDemoUser) {
      console.log(`Demo user - simulating bucket ${bucketName} creation`);
      return true;
    }
    
    // Check if bucket already exists
    const exists = await checkBucketExists(bucketName);
    if (exists) {
      console.log(`Bucket ${bucketName} already exists`);
      return true;
    }
    
    // Create bucket
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: isPublic,
      fileSizeLimit: fileSizeLimit,
    });
    
    if (error) {
      // Check if error is due to bucket already existing
      if (error.message && error.message.includes('already exists')) {
        console.log(`Bucket ${bucketName} already exists (from error)`);
        return true;
      }
      
      console.error(`Error creating bucket ${bucketName}:`, error);
      return false;
    }
    
    console.log(`Created bucket ${bucketName} successfully`);
    await ensureStoragePolicies(bucketName);
    return true;
  } catch (error) {
    console.error(`Exception creating bucket ${bucketName}:`, error);
    return false;
  }
};

/**
 * Ensure the specified bucket exists, creating it if necessary
 * @param {string} bucketName - Bucket name
 * @param {boolean} forceCreate - Force creation even if exists
 * @param {boolean} isPublic - Whether bucket should be public
 * @returns {Promise<boolean>} True if bucket exists or was created
 */
export const ensureBucketExists = async (
  bucketName: string = 'documents', 
  forceCreate: boolean = false,
  isPublic: boolean = false
): Promise<boolean> => {
  try {
    // Special handling for demo user
    const isDemoUser = await isUsingDemoCredentials();
    if (isDemoUser) {
      console.log(`Demo user - simulating bucket ${bucketName} exists`);
      return true;
    }
    
    // Check if bucket exists
    const exists = await checkBucketExists(bucketName);
    
    if (!exists || forceCreate) {
      console.log(`Bucket ${bucketName} doesn't exist or force create requested. Creating...`);
      return await createBucket(bucketName, isPublic);
    }
    
    console.log(`Bucket ${bucketName} already exists`);
    return true;
  } catch (error) {
    console.error(`Error in ensureBucketExists for ${bucketName}:`, error);
    return false;
  }
};
