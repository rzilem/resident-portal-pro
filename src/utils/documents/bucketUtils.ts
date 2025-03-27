
/**
 * Utility functions for Supabase storage bucket operations
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isUserAuthenticated } from './authUtils';
import { ensureBucketExists, ensureStoragePolicies } from './policyUtils';

/**
 * Check and create documents bucket if it doesn't exist
 * @param {boolean} forceCreate - Force creation even if bucket exists
 * @returns {Promise<boolean>} True if bucket exists or was created
 */
export const ensureDocumentsBucketExists = async (forceCreate = false): Promise<boolean> => {
  try {
    console.log('Checking if documents bucket exists...');
    
    // Check if user is authenticated first
    const isAuthenticated = await isUserAuthenticated();
    
    if (!isAuthenticated) {
      console.log('User not authenticated. Authentication is required to use document storage.');
      return false;
    }
    
    // Use the utility function to check and create the bucket if needed
    return await ensureBucketExists('documents', forceCreate, false);
  } catch (error) {
    console.error('Error checking/creating documents bucket:', error);
    toast.error('Error checking document storage status');
    return false;
  }
};

// Test if we can upload to the documents bucket
export const testBucketAccess = async (): Promise<boolean> => {
  try {
    // Check if user is authenticated first
    const isAuthenticated = await isUserAuthenticated();
    
    if (!isAuthenticated) {
      console.log('User not authenticated. Authentication is required to test bucket access.');
      return false;
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
    
    console.log('Bucket access test successful');
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
