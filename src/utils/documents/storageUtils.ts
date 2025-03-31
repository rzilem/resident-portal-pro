
/**
 * Utility functions for storage operations in document management
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { getCurrentUserId, isUsingDemoCredentials } from './authUtils';
import { isDemoMode } from '@/utils/auth/demoAuth';

// Don't import ensureBucketExists here - it's already exported in index.ts
// import { ensureBucketExists } from './bucketUtils';

/**
 * Upload a file to Supabase storage
 * @param {File} file - The file to upload
 * @param {string} bucketName - The bucket to upload to
 * @param {string} path - The path within the bucket
 * @returns {Promise<{path: string} | null>} The path to the uploaded file
 */
export const uploadFile = async (
  file: File, 
  bucketName: string,
  path: string = ''
): Promise<{path: string} | null> => {
  try {
    // For demo user, simulate successful upload
    if (isDemoMode()) {
      console.log(`[Demo mode] Simulating file upload: ${file.name} to ${bucketName}/${path}`);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
      return { path: `${path}/${file.name}` };
    }
    
    // Generate a unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${file.name.split('.')[0]}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;
    
    // Upload file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);
    
    if (error) {
      console.error('Error uploading file:', error);
      toast.error(`Failed to upload file: ${error.message}`);
      return null;
    }
    
    console.log(`File uploaded successfully: ${filePath}`);
    return { path: filePath };
  } catch (error) {
    console.error('Exception in uploadFile:', error);
    toast.error('An error occurred while uploading the file');
    return null;
  }
};

/**
 * Get a public URL for a file
 * @param {string} bucketName - The bucket where the file is stored
 * @param {string} filePath - The path to the file within the bucket
 * @returns {Promise<string | null>} The public URL
 */
export const getPublicUrl = async (
  bucketName: string,
  filePath: string
): Promise<string | null> => {
  try {
    // For demo user, return a mock URL
    if (await isUsingDemoCredentials()) {
      console.log(`[Demo mode] Returning mock URL for: ${bucketName}/${filePath}`);
      return `https://example.com/mock-file/${filePath}`;
    }
    
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    console.log('Generated public URL:', data.publicUrl);
    return data.publicUrl;
  } catch (error) {
    console.error('Exception in getPublicUrl:', error);
    return null;
  }
};

/**
 * Download a file from storage
 * @param {string} bucketName - The bucket where the file is stored
 * @param {string} filePath - The path to the file within the bucket
 * @returns {Promise<Blob | null>} The downloaded file as a Blob
 */
export const downloadFile = async (
  bucketName: string,
  filePath: string
): Promise<Blob | null> => {
  try {
    // For demo user, return a mock file
    if (await isUsingDemoCredentials()) {
      console.log(`[Demo mode] Returning mock file for: ${bucketName}/${filePath}`);
      // Create a simple text file as mock
      return new Blob(['This is a mock file for demo purposes.'], { type: 'text/plain' });
    }
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePath);
    
    if (error) {
      console.error('Error downloading file:', error);
      toast.error(`Failed to download file: ${error.message}`);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception in downloadFile:', error);
    toast.error('An error occurred while downloading the file');
    return null;
  }
};

/**
 * Delete a file from storage
 * @param {string} bucketName - The bucket where the file is stored
 * @param {string} filePath - The path to the file within the bucket
 * @returns {Promise<boolean>} Whether the deletion was successful
 */
export const deleteFile = async (
  bucketName: string,
  filePath: string
): Promise<boolean> => {
  try {
    // For demo user, simulate successful deletion
    if (await isUsingDemoCredentials()) {
      console.log(`[Demo mode] Simulating file deletion: ${bucketName}/${filePath}`);
      return true;
    }
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) {
      console.error('Error deleting file:', error);
      toast.error(`Failed to delete file: ${error.message}`);
      return false;
    }
    
    console.log(`File deleted successfully: ${filePath}`);
    return true;
  } catch (error) {
    console.error('Exception in deleteFile:', error);
    toast.error('An error occurred while deleting the file');
    return false;
  }
};

/**
 * List files in a storage bucket with an optional path prefix
 * @param {string} bucketName - The bucket to list files from
 * @param {string} path - Optional path prefix to filter results
 * @returns {Promise<Array<{ name: string, path: string, size: number }> | null>} Array of file objects or null on error
 */
export const listFiles = async (
  bucketName: string,
  path: string = ''
): Promise<Array<{ name: string, path: string, size: number }> | null> => {
  try {
    // For demo user, return mock files
    if (await isUsingDemoCredentials()) {
      console.log(`[Demo mode] Returning mock file list for: ${bucketName}/${path}`);
      return [
        { name: 'example1.pdf', path: `${path}/example1.pdf`, size: 1024 },
        { name: 'example2.docx', path: `${path}/example2.docx`, size: 2048 },
        { name: 'example3.xlsx', path: `${path}/example3.xlsx`, size: 3072 }
      ];
    }
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(path);
    
    if (error) {
      console.error('Error listing files:', error);
      toast.error(`Failed to list files: ${error.message}`);
      return null;
    }
    
    // Filter out folders and map to a more useful format
    const files = data
      .filter(item => !item.id.endsWith('/'))
      .map(item => ({
        name: item.name,
        path: path ? `${path}/${item.name}` : item.name,
        size: item.metadata?.size || 0
      }));
    
    return files;
  } catch (error) {
    console.error('Exception in listFiles:', error);
    toast.error('An error occurred while listing files');
    return null;
  }
};

/**
 * Create a folder in a storage bucket
 * @param {string} bucketName - The bucket where the folder should be created
 * @param {string} folderPath - The path for the new folder
 * @returns {Promise<boolean>} Whether the folder creation was successful
 */
export const createFolder = async (
  bucketName: string,
  folderPath: string
): Promise<boolean> => {
  try {
    // For demo user, simulate successful folder creation
    if (await isUsingDemoCredentials()) {
      console.log(`[Demo mode] Simulating folder creation: ${bucketName}/${folderPath}`);
      return true;
    }
    
    // Ensure the path ends with a slash to indicate it's a folder
    const normalizedPath = folderPath.endsWith('/') ? folderPath : `${folderPath}/`;
    
    // Create an empty file with the folder path to simulate a folder
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(normalizedPath + '.folder', new Blob([]));
    
    if (error) {
      console.error('Error creating folder:', error);
      toast.error(`Failed to create folder: ${error.message}`);
      return false;
    }
    
    console.log(`Folder created successfully: ${normalizedPath}`);
    return true;
  } catch (error) {
    console.error('Exception in createFolder:', error);
    toast.error('An error occurred while creating the folder');
    return false;
  }
};

/**
 * Get a user-specific path for storing files
 * @param {string} baseFolder - Base folder name
 * @returns {Promise<string>} Path including user ID
 */
export const getUserSpecificPath = async (baseFolder: string): Promise<string> => {
  const userId = await getCurrentUserId();
  if (!userId) {
    console.warn('No user ID available for path creation');
    return baseFolder;
  }
  return `${baseFolder}/${userId}`;
};
