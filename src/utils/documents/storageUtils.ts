
/**
 * Utility functions for Supabase storage operations
 */

import { supabase } from '@/integrations/supabase/client';

// Check and create documents bucket if it doesn't exist
export const ensureDocumentsBucketExists = async (forceCreate = false): Promise<boolean> => {
  try {
    console.log('Checking if documents bucket exists...');
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }
    
    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket || forceCreate) {
      console.log('Documents bucket not found or force create requested, attempting to create it...');
      
      // Get the current user to ensure we're authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
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
          
          // Try to fetch the buckets again to confirm it exists now
          const { data: checkBuckets } = await supabase.storage.listBuckets();
          if (checkBuckets?.some(b => b.name === 'documents')) {
            console.log('Confirmed documents bucket exists on second check');
            return true;
          }
        }
        
        // If here, bucket could not be confirmed to exist
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
        return false;
      }
      
      return verifyBuckets?.some(b => b.name === 'documents') || false;
    } else {
      console.log('Documents bucket already exists');
      return true;
    }
  } catch (error) {
    console.error('Error checking/creating documents bucket:', error);
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
