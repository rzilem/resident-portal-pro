
import { supabase } from '@/integrations/supabase/client';

/**
 * Create a folder structure in Supabase storage
 * @param bucketName Storage bucket name
 * @param folderPath Full path of the folder to create
 * @returns Promise resolving to success boolean
 */
export const createFolder = async (
  bucketName: string,
  folderPath: string
): Promise<boolean> => {
  try {
    // Make sure the folder path ends with a slash
    const normalizedPath = folderPath.endsWith('/') ? folderPath : `${folderPath}/`;
    
    // For Supabase storage, folders are represented by creating a zero-byte file
    // with the folder path that ends with a slash (or special marker file)
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(`${normalizedPath}.folder`, new Blob([]), {
        upsert: true
      });
    
    if (error) {
      console.error(`Error creating folder ${normalizedPath}:`, error);
      return false;
    }
    
    console.log(`Created folder ${normalizedPath} successfully`);
    return true;
  } catch (error) {
    console.error('Exception in createFolder:', error);
    return false;
  }
};

/**
 * List folders in a storage bucket
 * @param bucketName Storage bucket name
 * @param parentPath Parent folder path (optional)
 * @returns Promise resolving to array of folder paths
 */
export const listFolders = async (
  bucketName: string,
  parentPath: string = ''
): Promise<string[] | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(parentPath, {
        // Setting folder-only doesn't work in Supabase JS v2, need to filter
        sortBy: { column: 'name', order: 'asc' }
      });
    
    if (error) {
      console.error('Error listing folders:', error);
      return null;
    }
    
    if (!data) {
      return [];
    }
    
    // Filter for folders
    const folders = data
      .filter(item => item.name.endsWith('/') || item.name.endsWith('.folder'))
      .map(folder => {
        // Clean up folder name
        let name = folder.name;
        if (name.endsWith('.folder')) {
          name = name.replace('.folder', '/');
        }
        return name;
      });
    
    return folders;
  } catch (error) {
    console.error('Exception in listFolders:', error);
    return null;
  }
};

/**
 * Delete a folder and its contents from storage
 * @param bucketName Storage bucket name
 * @param folderPath Path to the folder to delete
 * @returns Promise resolving to success boolean
 */
export const deleteFolder = async (
  bucketName: string,
  folderPath: string
): Promise<boolean> => {
  try {
    // Make sure the folder path ends with a slash
    const normalizedPath = folderPath.endsWith('/') ? folderPath : `${folderPath}/`;
    
    // List all files in the folder
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(normalizedPath);
    
    if (error) {
      console.error(`Error listing files in folder ${normalizedPath}:`, error);
      return false;
    }
    
    // Delete all files in the folder
    if (data && data.length > 0) {
      const filePaths = data.map(file => `${normalizedPath}${file.name}`);
      
      const { error: deleteError } = await supabase.storage
        .from(bucketName)
        .remove(filePaths);
      
      if (deleteError) {
        console.error(`Error deleting files in folder ${normalizedPath}:`, deleteError);
        return false;
      }
    }
    
    // Delete the folder marker file
    const { error: deleteMarkerError } = await supabase.storage
      .from(bucketName)
      .remove([`${normalizedPath}.folder`]);
    
    if (deleteMarkerError) {
      console.warn(`Error deleting folder marker file ${normalizedPath}.folder:`, deleteMarkerError);
      // Continue anyway, since we've deleted the contents
    }
    
    console.log(`Deleted folder ${normalizedPath} successfully`);
    return true;
  } catch (error) {
    console.error('Exception in deleteFolder:', error);
    return false;
  }
};
