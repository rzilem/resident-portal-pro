
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
    
    // Use the ensureBucketExists function from policyUtils
    const result = await ensureBucketExists('documents', forceCreate, false);
    
    if (!result) {
      toast.error('Failed to ensure document storage is available');
      return false;
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
