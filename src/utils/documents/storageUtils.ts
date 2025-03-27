
/**
 * Utility functions for Supabase storage operations
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Check and create documents bucket if it doesn't exist
export const ensureDocumentsBucketExists = async (forceCreate = false): Promise<boolean> => {
  try {
    console.log('Checking if documents bucket exists...');
    
    // Check if user is authenticated first
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log('User not authenticated. Authentication is required to use document storage.');
      return false;
    }
    
    console.log('User authenticated:', user.id);
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      
      // If we get a permission error here, check if the user is authenticated
      if (listError.message?.includes('permission') || listError.message?.includes('403')) {
        console.log('Permission error listing buckets. Authentication may be required.');
        
        if (!user) {
          console.log('User not authenticated. Authentication is required to use document storage.');
          return false;
        }
        
        // User is authenticated but still getting permission errors
        console.log('User is authenticated but has permission issues. Attempting to use bucket anyway.');
        return true;
      }
      
      return false;
    }
    
    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket || forceCreate) {
      console.log('Documents bucket not found or force create requested, attempting to create it...');
      
      try {
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
            toast.success("Using existing document storage");
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
          
          return false;
        }
        
        console.log('Documents bucket created successfully');
        toast.success("Document storage created successfully");
        
        // Add a slight delay to allow bucket creation to propagate
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return true;
      } catch (createError) {
        console.error('Exception during bucket creation:', createError);
        return false;
      }
    } else {
      console.log('Documents bucket already exists');
      return true;
    }
  } catch (error) {
    console.error('Error checking/creating documents bucket:', error);
    return false;
  }
};

// Test if we can upload to the documents bucket
export const testBucketAccess = async (): Promise<boolean> => {
  try {
    // Check if user is authenticated first
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('User not authenticated. Authentication is required to test bucket access.');
      return false;
    }
    
    console.log('User authenticated for bucket access test:', user.id);
    
    // Create a tiny test file
    const testFile = new Blob(['test'], { type: 'text/plain' });
    const testFilePath = `test-${Date.now()}.txt`;
    
    // Try to upload it with a timeout of 4 seconds (reduced from 5)
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
