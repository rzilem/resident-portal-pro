
/**
 * Utility functions for Supabase storage bucket operations
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isUserAuthenticated } from './authUtils';
import { createStoragePolicy } from './policyUtils';

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
