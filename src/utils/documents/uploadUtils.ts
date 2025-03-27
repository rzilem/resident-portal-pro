
/**
 * Utility functions for document uploads
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { isUserAuthenticated } from './authUtils';
import { ensureDocumentsBucketExists } from './bucketUtils';

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

/**
 * Generate download URL for a document
 * @param {string} filePath - Path to the file
 * @returns {Promise<string>} Download URL
 */
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

/**
 * Delete file from storage
 * @param {string} filePath - Path to the file
 * @returns {Promise<boolean>} True if file was deleted
 */
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
