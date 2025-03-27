
/**
 * Utilities for managing document storage buckets
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isAuthenticatedIncludingDemo } from './authUtils';

/**
 * Ensure the documents bucket exists (this is a public function used by other modules)
 * @param {boolean} forceCreate - Force creation even if bucket exists
 * @returns {Promise<boolean>} - True if bucket exists or was created
 */
export const ensureDocumentsBucketExists = async (forceCreate: boolean = false): Promise<boolean> => {
  // Reuse the existing function but with the documents bucket name
  return await ensureBucketExists('documents', forceCreate, false);
};

/**
 * Test access to the bucket to verify permissions are set correctly
 * @param {string} bucketName - Bucket name to test
 * @returns {Promise<boolean>} - True if access is confirmed
 */
export const testBucketAccess = async (bucketName: string = 'documents'): Promise<boolean> => {
  try {
    // Try to list files in bucket as a simple access test
    const { data, error } = await supabase.storage.from(bucketName).list();
    
    if (error) {
      console.error(`Error testing access to ${bucketName} bucket:`, error);
      return false;
    }
    
    console.log(`Successfully accessed ${bucketName} bucket, found ${data?.length || 0} files`);
    return true;
  } catch (error) {
    console.error(`Exception testing access to ${bucketName} bucket:`, error);
    return false;
  }
};

/**
 * Check if a file exists in a storage bucket
 * @param {string} bucketName - Bucket name
 * @param {string} filePath - File path within bucket
 * @returns {Promise<boolean>} True if file exists
 */
export const fileExists = async (bucketName: string, filePath: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .list('', {
        search: filePath
      });
    
    if (error) {
      console.error(`Error checking if file exists in ${bucketName}:`, error);
      return false;
    }
    
    return data?.some(file => file.name === filePath) || false;
  } catch (error) {
    console.error(`Exception checking if file exists in ${bucketName}:`, error);
    return false;
  }
};

/**
 * List all files in a bucket
 * @param {string} bucketName - Bucket name
 * @param {string} folderPath - Optional folder path
 * @returns {Promise<string[] | null>} Array of file paths or null if error
 */
export const listFiles = async (bucketName: string, folderPath: string = ''): Promise<string[] | null> => {
  try {
    // First check if user is authenticated
    const isAuthenticated = await isAuthenticatedIncludingDemo();
    if (!isAuthenticated) {
      console.error('Authentication required to list files');
      toast.error('Please log in to access documents');
      return null;
    }
    
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .list(folderPath);
    
    if (error) {
      console.error(`Error listing files in ${bucketName}/${folderPath}:`, error);
      return null;
    }
    
    return data.map(file => `${folderPath ? folderPath + '/' : ''}${file.name}`);
  } catch (error) {
    console.error(`Exception listing files in ${bucketName}/${folderPath}:`, error);
    return null;
  }
};

/**
 * Get public URL for a file
 * @param {string} bucketName - Bucket name
 * @param {string} filePath - File path within bucket
 * @returns {string | null} Public URL or null if error
 */
export const getPublicUrl = (bucketName: string, filePath: string): string | null => {
  try {
    const { data } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    return data?.publicUrl || null;
  } catch (error) {
    console.error(`Exception getting public URL for ${bucketName}/${filePath}:`, error);
    return null;
  }
};

/**
 * Check if a bucket exists in storage
 * @param {string} bucketName - Bucket name to check
 * @returns {Promise<boolean>} True if exists
 */
const checkBucketExists = async (bucketName: string): Promise<boolean> => {
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
 * Check if the user is using demo credentials
 * This allows special handling for the demo user who might not have a proper Supabase auth session
 * @returns {Promise<boolean>} True if using demo credentials
 */
const isUsingDemoCredentials = async (): Promise<boolean> => {
  // First check for a proper session
  const { data: { session } } = await supabase.auth.getSession();
  
  // If we have a proper session with email matching demo credentials
  if (session?.user?.email === 'admin@residentpro.com') {
    return true;
  }
  
  // Also check localStorage for legacy auth state
  const storedEmail = localStorage.getItem('userEmail');
  return storedEmail === 'admin@residentpro.com';
};

/**
 * Create a bucket in storage
 * @param {string} bucketName - Bucket name to create
 * @param {boolean} isPublic - Whether bucket should be public
 * @param {number} fileSizeLimit - Max file size in bytes
 * @returns {Promise<boolean>} True if created or already exists
 */
const createBucket = async (
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

/**
 * Log instructions to manually set storage policies in Supabase dashboard
 * @param {string} bucketName - Bucket name
 * @returns {Promise<void>}
 */
const ensureStoragePolicies = async (bucketName: string = 'documents'): Promise<void> => {
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
