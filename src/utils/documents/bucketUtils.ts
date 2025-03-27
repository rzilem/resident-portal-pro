
/**
 * Utility functions for Supabase storage bucket operations
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isUserAuthenticated } from './authUtils';
import { ensureStoragePolicies } from './policyUtils';

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
      toast.error('Failed to check document storage status');
      return false;
    }
    
    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket || forceCreate) {
      console.log('Documents bucket not found or force create requested, attempting to create it...');
      
      // Create the documents bucket
      const { error: createError } = await supabase.storage.createBucket('documents', {
        public: false, // Use policies to control access
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (createError) {
        console.error('Error creating documents bucket:', createError);
        
        // Check if error is due to bucket already existing
        if (createError.message && createError.message.includes('already exists')) {
          console.log('Bucket already exists but was not found in initial check');
          toast.success('Using existing document storage');
          await ensureStoragePolicies('documents');
          return true;
        }
        
        // Check if error is due to permissions
        if (createError.message && (createError.message.includes('permission') || 
            createError.message.includes('policy') || 
            createError.message.includes('403'))) {
          console.log('Permission error creating bucket. Will attempt to use it anyway.');
          toast.info('Using existing document storage');
          
          // Log policy instructions for manual setup
          await ensureStoragePolicies('documents');
          
          return true;
        }
        
        toast.error('Failed to create document storage');
        return false;
      }
      
      console.log('Documents bucket created successfully');
      toast.success('Document storage created successfully');
      
      // Set up storage policies
      await ensureStoragePolicies('documents');
      
      return true;
    }
    
    console.log('Documents bucket is available');
    return true;
  } catch (error) {
    console.error('Error checking/creating documents bucket:', error);
    toast.error('Error checking document storage status');
    return false;
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
      
      // If we get a permission error, show the policy instructions
      if (error.message?.includes('permission') || error.message?.includes('403')) {
        console.log('Permission error testing bucket access. Check storage policies.');
        await ensureStoragePolicies('documents');
      }
      
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

/**
 * Upload a document to storage
 * @param {File} file - File to upload
 * @param {string} category - Document category
 * @param {string} description - Document description
 * @param {string[]} tags - Document tags
 * @returns {Promise<{success: boolean, path?: string, url?: string, error?: string}>} Upload result
 */
export const uploadDocumentToStorage = async (
  file: File,
  category: string = 'uncategorized',
  description: string = '',
  tags: string[] = []
): Promise<{success: boolean, path?: string, url?: string, error?: string}> => {
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
    
    // Create a unique file path
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 12);
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${category}/${timestamp}-${randomString}-${sanitizedFileName}`;
    
    console.log(`Uploading file to path: ${filePath}`);
    
    // Upload file to storage
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Use upsert to overwrite if file exists
      });
    
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
      return { success: true, path: filePath, error: 'URL generation failed' };
    }
    
    toast.success('File uploaded successfully');
    return { success: true, path: filePath, url };
  } catch (error) {
    console.error('Unexpected upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(`Upload failed: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
};
