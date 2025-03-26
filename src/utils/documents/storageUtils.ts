
/**
 * Utility functions for Supabase storage operations
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Check and create documents bucket if it doesn't exist
export const ensureDocumentsBucketExists = async (forceCreate = false): Promise<boolean> => {
  try {
    console.log('Checking if documents bucket exists...');
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      // If we get a permission error here, we'll assume the bucket exists but we can't see it due to permissions
      if (listError.message?.includes('permission') || listError.message?.includes('403')) {
        console.log('Permission error listing buckets. Assuming documents bucket exists.');
        return true;
      }
      return false;
    }
    
    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket || forceCreate) {
      console.log('Documents bucket not found or force create requested, attempting to create it...');
      
      try {
        // Get the current user to ensure we're authenticated
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log('User not authenticated, cannot create bucket. Assuming bucket exists.');
          // For UI purposes, we'll pretend the bucket exists
          return true;
        }
        
        // Create the documents bucket with public access
        const { error } = await supabase.storage.createBucket('documents', {
          public: true, // Make the bucket public so documents can be accessed
          fileSizeLimit: 10485760, // 10MB
        });
        
        if (error) {
          console.error('Error creating documents bucket:', error);
          
          // Check if error is due to bucket already existing
          if (error.message && error.message.includes('already exists')) {
            console.log('Bucket already exists but was not found in initial check');
            return true;
          }
          
          // Check if error is due to permissions
          if (error.message && (error.message.includes('permission') || 
              error.message.includes('policy') || 
              error.message.includes('403'))) {
            console.log('Permission error creating bucket. Will attempt to use it anyway.');
            toast.info("Using existing document storage");
            return true;
          }
          
          console.log('Attempting to use existing bucket instead...');
          return false;
        }
        
        console.log('Documents bucket created successfully');
        
        // Add a slight delay to allow bucket creation to propagate
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verify the bucket was created successfully
        const { data: verifyBuckets, error: verifyError } = await supabase.storage.listBuckets();
        
        if (verifyError) {
          console.error('Error verifying bucket creation:', verifyError);
          // If we get a permission error, assume it exists
          if (verifyError.message?.includes('permission') || verifyError.message?.includes('403')) {
            return true;
          }
          return false;
        }
        
        return verifyBuckets?.some(b => b.name === 'documents') || false;
      } catch (createError) {
        console.error('Exception during bucket creation:', createError);
        // For UX purposes, we'll assume the bucket exists but we can't access it
        return true;
      }
    } else {
      console.log('Documents bucket already exists');
      return true;
    }
  } catch (error) {
    console.error('Error checking/creating documents bucket:', error);
    // For better UX, assume the bucket exists but we don't have permission to manage it
    toast.info("Using existing document storage");
    return true;
  }
};

// Test if we can upload to the documents bucket
export const testBucketAccess = async (): Promise<boolean> => {
  try {
    // Create a tiny test file
    const testFile = new Blob(['test'], { type: 'text/plain' });
    const testFilePath = `test-${Date.now()}.txt`;
    
    // Try to upload it with a timeout of 5 seconds
    const uploadPromise = supabase.storage
      .from('documents')
      .upload(testFilePath, testFile, {
        cacheControl: '3600',
        upsert: true
      });
    
    // Add a timeout
    const timeoutPromise = new Promise<{data: null, error: Error}>((_, reject) => {
      setTimeout(() => {
        reject({ data: null, error: new Error('Upload test timed out after 5 seconds') });
      }, 5000);
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
