
/**
 * Utility functions for Supabase storage operations
 */

import { supabase } from '@/integrations/supabase/client';

// Check and create documents bucket if it doesn't exist
export const ensureDocumentsBucketExists = async (): Promise<boolean> => {
  try {
    console.log('Checking if documents bucket exists...');
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }
    
    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket) {
      console.log('Documents bucket not found, attempting to create it...');
      
      // Get the current user to ensure we're authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User is not authenticated. Authentication is required to create storage buckets.');
        return false;
      }
      
      // Create the documents bucket with public access
      const { error } = await supabase.storage.createBucket('documents', {
        public: true, // Make the bucket public so documents can be accessed
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (error) {
        console.error('Error creating documents bucket:', error);
        console.log('Attempting to use existing bucket instead...');
        
        // Try to access the bucket again
        const { data: checkBuckets } = await supabase.storage.listBuckets();
        if (checkBuckets?.some(b => b.name === 'documents')) {
          console.log('Found existing documents bucket on second check');
          return true;
        }
        
        return false;
      }
      
      console.log('Documents bucket created successfully');
      return true;
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
