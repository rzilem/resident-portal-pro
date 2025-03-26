
/**
 * Utility functions for Supabase storage operations
 */

import { supabase } from '@/integrations/supabase/client';

// Check and create documents bucket if it doesn't exist
export const ensureDocumentsBucketExists = async (): Promise<boolean> => {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket) {
      console.log('Documents bucket not found, creating it...');
      // Create the documents bucket
      const { error } = await supabase.storage.createBucket('documents', {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (error) {
        console.error('Error creating documents bucket:', error);
        return false;
      }
      
      console.log('Documents bucket created successfully');
    } else {
      console.log('Documents bucket already exists');
    }
    
    return true;
  } catch (error) {
    console.error('Error checking/creating documents bucket:', error);
    return false;
  }
};

// Generate download URL for a document
export const getDownloadUrl = async (filePath: string): Promise<string> => {
  try {
    // Get download URL
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 60); // 60 seconds expiry
    
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
