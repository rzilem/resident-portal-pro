
/**
 * Utilities for managing document storage buckets
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isAuthenticatedIncludingDemo } from './authUtils';

/**
 * Check if a file exists in a storage bucket
 * @param {string} bucketName - Bucket name
 * @param {string} filePath - File path within bucket
 * @returns {Promise<boolean>} True if file exists
 */
export const fileExists = async (bucketName: string, filePath: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .list('', {
        search: filePath
      });
    
    if (error) {
      console.error(`Error checking if file exists in ${bucketName}:`, error);
      return false;
    }
    
    return data?.some(file => file.name === filePath) || false;
  } catch (error) {
    console.error(`Exception checking if file exists in ${bucketName}:`, error);
    return false;
  }
};

/**
 * List all files in a bucket
 * @param {string} bucketName - Bucket name
 * @param {string} folderPath - Optional folder path
 * @returns {Promise<string[] | null>} Array of file paths or null if error
 */
export const listFiles = async (bucketName: string, folderPath: string = ''): Promise<string[] | null> => {
  try {
    // First check if user is authenticated
    const isAuthenticated = await isAuthenticatedIncludingDemo();
    if (!isAuthenticated) {
      console.error('Authentication required to list files');
      toast.error('Please log in to access documents');
      return null;
    }
    
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .list(folderPath);
    
    if (error) {
      console.error(`Error listing files in ${bucketName}/${folderPath}:`, error);
      return null;
    }
    
    return data.map(file => `${folderPath ? folderPath + '/' : ''}${file.name}`);
  } catch (error) {
    console.error(`Exception listing files in ${bucketName}/${folderPath}:`, error);
    return null;
  }
};

/**
 * Get public URL for a file
 * @param {string} bucketName - Bucket name
 * @param {string} filePath - File path within bucket
 * @returns {string | null} Public URL or null if error
 */
export const getPublicUrl = (bucketName: string, filePath: string): string | null => {
  try {
    const { data } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    return data?.publicUrl || null;
  } catch (error) {
    console.error(`Exception getting public URL for ${bucketName}/${filePath}:`, error);
    return null;
  }
};
