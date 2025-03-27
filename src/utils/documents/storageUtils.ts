
/**
 * Utility functions for Supabase storage operations
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if user is authenticated
 */
export const isUserAuthenticated = async (): Promise<boolean> => {
  const { data: sessionData } = await supabase.auth.getSession();
  return !!sessionData.session?.user;
};

/**
 * Check and create documents bucket if it doesn't exist
 * @param {boolean} forceCreate - Force creation even if bucket exists
 * @returns {Promise<boolean>} True if bucket exists or was created
 */
export const ensureDocumentsBucketExists = async (forceCreate = false): Promise<boolean> => {
  try {
    console.log('Checking if documents bucket exists...');
    
    // Check if user is authenticated first with direct session check
    const isAuthenticated = await isUserAuthenticated();
    
    if (!isAuthenticated) {
      console.log('User not authenticated. Authentication is required to use document storage.');
      toast.error('Please log in to access document storage');
      return false;
    }
    
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    
    if (user) {
      console.log('User authenticated:', user.id);
    }
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      
      // If we get a permission error here, recheck authentication
      if (listError.message?.includes('permission') || listError.message?.includes('403')) {
        console.log('Permission error listing buckets. Rechecking authentication...');
        
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          console.log('User not authenticated after recheck.');
          toast.error('Authentication is required to use document storage');
          return false;
        }
        
        // User is authenticated but still getting permission issues
        console.log('User is authenticated but has permission issues. Attempting to use bucket anyway.');
        return true;
      }
      
      toast.error(`Error accessing storage: ${listError.message}`);
      return false;
    }
    
    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket || forceCreate) {
      console.log('Documents bucket not found or force create requested, attempting to create it...');
      
      try {
        // Create the documents bucket with private access (not public)
        const { error } = await supabase.storage.createBucket('documents', {
          public: false, // Make the bucket private for better security
          fileSizeLimit: 10485760, // 10MB
        });
        
        if (error) {
          console.error('Error creating documents bucket:', error);
          
          // Check if error is due to bucket already existing
          if (error.message && error.message.includes('already exists')) {
            console.log('Bucket already exists but was not found in initial check');
            toast.success("Using existing document storage");
            return true;
          }
          
          // Check if error is due to permissions
          if (error.message && (error.message.includes('permission') || 
              error.message.includes('policy') || 
              error.message.includes('403'))) {
            console.log('Permission error creating bucket. Will attempt to use it anyway.');
            toast.info("Using existing document storage");
            
            // Try to create a storage policy if the bucket exists but access is denied
            try {
              // Define the policy parameters interface correctly
              interface StoragePolicyParams {
                bucket_name: string;
                policy_name: string;
                definition: string;
              }
              
              // Call RPC with properly typed parameters
              await supabase.rpc<null, StoragePolicyParams>('create_storage_policy', {
                bucket_name: 'documents',
                policy_name: 'allow_authenticated_users',
                definition: 'auth.uid() IS NOT NULL'
              });
              
              console.log('Created storage policy for authenticated users');
            } catch (policyError) {
              console.log('Error creating storage policy:', policyError);
              // Continue anyway, policy might already exist
            }
            
            return true;
          }
          
          toast.error(`Failed to create document storage: ${error.message}`);
          return false;
        }
        
        console.log('Documents bucket created successfully');
        toast.success("Document storage created successfully");
        
        // Add a slight delay to allow bucket creation to propagate
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create storage policies for authenticated users
        try {
          // Add policy for reading files (download)
          await createStoragePolicy('documents', 'allow_authenticated_users_read', 
            'auth.uid() IS NOT NULL', 'SELECT');
          
          // Add policy for uploading files
          await createStoragePolicy('documents', 'allow_authenticated_users_upload', 
            'auth.uid() IS NOT NULL', 'INSERT');
          
          // Add policy for updating files
          await createStoragePolicy('documents', 'allow_authenticated_users_update', 
            'auth.uid() IS NOT NULL', 'UPDATE');
          
          // Add policy for deleting files
          await createStoragePolicy('documents', 'allow_authenticated_users_delete', 
            'auth.uid() IS NOT NULL', 'DELETE');
            
          console.log('Created all storage policies for authenticated users');
        } catch (policyError) {
          console.log('Error creating some storage policies:', policyError);
          // Continue anyway, some policies might be created
        }
        
        return true;
      } catch (createError) {
        console.error('Exception during bucket creation:', createError);
        toast.error('Failed to create document storage');
        return false;
      }
    } else {
      console.log('Documents bucket already exists');
      return true;
    }
  } catch (error) {
    console.error('Error checking/creating documents bucket:', error);
    toast.error('Error checking document storage status');
    return false;
  }
};

/**
 * Create a storage policy for the documents bucket
 * @param {string} bucketName - Bucket name
 * @param {string} policyName - Policy name
 * @param {string} definition - Policy definition
 * @param {string} operation - Policy operation (SELECT, INSERT, UPDATE, DELETE)
 * @returns {Promise<void>}
 */
const createStoragePolicy = async (
  bucketName: string, 
  policyName: string, 
  definition: string, 
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'
): Promise<void> => {
  try {
    // Define the policy parameters interface
    interface StoragePolicyParams {
      bucket_name: string;
      policy_name: string;
      definition: string;
      operation: string;
    }
    
    // Call RPC with properly typed parameters
    await supabase.rpc<null, StoragePolicyParams>('create_storage_policy', {
      bucket_name: bucketName,
      policy_name: policyName,
      definition: definition,
      operation: operation
    });
    
    console.log(`Created storage policy ${policyName} for ${operation} operation`);
  } catch (error) {
    console.error(`Error creating storage policy ${policyName}:`, error);
    throw error;
  }
};

/**
 * Upload a document to storage
 * @param {File} file - File to upload
 * @param {string} [customPath] - Optional custom file path
 * @returns {Promise<{success: boolean, url?: string, error?: string}>} Upload result
 */
export const uploadDocument = async (
  file: File, 
  customPath?: string
): Promise<{success: boolean, url?: string, error?: string}> => {
  try {
    // Check if user is authenticated
    const isAuthenticated = await isUserAuthenticated();
    if (!isAuthenticated) {
      toast.error('Please log in to upload files');
      return { success: false, error: 'Authentication required' };
    }
    
    // Ensure bucket exists
    const bucketExists = await ensureDocumentsBucketExists();
    if (!bucketExists) {
      return { success: false, error: 'Document storage is not available' };
    }
    
    // Create a unique file path using timestamp + original name or use custom path
    const fileExtension = file.name.split('.').pop() || '';
    const timestamp = Date.now();
    const uniqueId = uuidv4().substring(0, 8);
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    const filePath = customPath || `${timestamp}-${uniqueId}-${sanitizedFileName}`;
    
    console.log(`Uploading file to path: ${filePath}`);
    
    // Upload file to storage with a timeout of 60 seconds
    const uploadPromise = supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Use upsert to overwrite if file exists
      });
    
    // Add a timeout
    const timeoutPromise = new Promise<{data: null, error: Error}>((_, reject) => {
      setTimeout(() => {
        reject({ data: null, error: new Error('Upload timed out after 60 seconds') });
      }, 60000); // 60 seconds timeout
    });
    
    // Race the upload against the timeout
    const { data, error } = await Promise.race([uploadPromise, timeoutPromise]);
    
    if (error) {
      console.error('Error uploading document:', error);
      toast.error(`Upload failed: ${error.message}`);
      return { success: false, error: error.message };
    }
    
    console.log('Document uploaded successfully');
    
    // Get the public URL of the uploaded file
    const { data: publicUrlData } = await supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    
    const url = publicUrlData?.publicUrl;
    
    if (!url) {
      console.error('Failed to generate download URL');
      toast.error('File uploaded but URL generation failed');
      return { success: true, error: 'URL generation failed' };
    }
    
    toast.success('File uploaded successfully');
    return { success: true, url };
  } catch (error) {
    console.error('Unexpected upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(`Upload failed: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
};

// Test if we can upload to the documents bucket
export const testBucketAccess = async (): Promise<boolean> => {
  try {
    // Check if user is authenticated first with direct session check
    const isAuthenticated = await isUserAuthenticated();
    
    if (!isAuthenticated) {
      console.log('User not authenticated. Authentication is required to test bucket access.');
      return false;
    }
    
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    
    if (user) {
      console.log('User authenticated for bucket access test:', user.id);
    }
    
    // Create a tiny test file
    const testFile = new Blob(['test'], { type: 'text/plain' });
    const testFilePath = `test-${Date.now()}.txt`;
    
    // Try to upload it with a timeout of 4 seconds
    const uploadPromise = supabase.storage
      .from('documents')
      .upload(testFilePath, testFile, {
        cacheControl: '3600',
        upsert: true
      });
    
    // Add a timeout
    const timeoutPromise = new Promise<{data: null, error: Error}>((_, reject) => {
      setTimeout(() => {
        reject({ data: null, error: new Error('Upload test timed out after 4 seconds') });
      }, 4000);
    });
    
    // Race the upload against the timeout
    const { data, error } = await Promise.race([uploadPromise, timeoutPromise]);
    
    if (error) {
      console.error('Error testing bucket access:', error);
      return false;
    }
    
    // Clean up the test file
    await supabase.storage
      .from('documents')
      .remove([testFilePath]);
    
    return true;
  } catch (error) {
    console.error('Exception during bucket access test:', error);
    return false;
  }
};

// Generate download URL for a document
export const getDownloadUrl = async (filePath: string): Promise<string> => {
  try {
    // Get public URL if bucket is public
    const { data: publicUrlData } = await supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    
    if (publicUrlData && publicUrlData.publicUrl) {
      return publicUrlData.publicUrl;
    }
    
    // Fall back to signed URL if not public
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
    
    if (error) {
      console.error('Error creating signed URL:', error);
      throw error;
    }
    
    if (!data || !data.signedUrl) {
      throw new Error('Failed to generate download URL');
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Error generating download URL:', error);
    throw error;
  }
};

// Delete file from storage
export const deleteStorageFile = async (filePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from('documents')
      .remove([filePath]);
    
    if (error) {
      console.error('Error deleting file from storage:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteStorageFile:', error);
    return false;
  }
};
