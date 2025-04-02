
import { supabase } from "@/integrations/supabase/client";
import { debugLog, errorLog } from "@/utils/debug";
import { toast } from "sonner";

/**
 * Get the public URL for a file in a storage bucket
 * @param bucket The storage bucket name
 * @param path Path to the file within the bucket
 * @param options Additional options for URL generation
 * @returns Public URL of the file or fallback URL if specified
 */
export const getFileUrl = (
  bucket: string, 
  path: string, 
  options: {
    fallbackUrl?: string;
    showErrorToast?: boolean;
    cacheBuster?: boolean;
  } = {}
): string => {
  try {
    debugLog(`Generating URL for ${path} in ${bucket}`);
    
    if (!bucket || !path) {
      const errorMsg = `Invalid parameters: bucket=${bucket}, path=${path}`;
      errorLog(errorMsg);
      
      if (options.showErrorToast) {
        toast.error('Failed to load file: Invalid parameters');
      }
      
      return options.fallbackUrl || '';
    }
    
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    if (!data || !data.publicUrl) {
      errorLog(`Failed to generate public URL for ${path}`);
      
      if (options.showErrorToast) {
        toast.error(`Failed to load file from storage`);
      }
      
      return options.fallbackUrl || '';
    }
    
    // Add cache buster if requested
    let url = data.publicUrl;
    if (options.cacheBuster) {
      const cacheBuster = `cb=${Date.now()}`;
      url += (url.includes('?') ? '&' : '?') + cacheBuster;
    }
    
    debugLog(`Generated URL: ${url}`);
    return url;
  } catch (error) {
    errorLog(`Error generating URL for path: ${path} in bucket: ${bucket}`, error);
    
    if (options.showErrorToast) {
      toast.error('Error retrieving file URL');
    }
    
    return options.fallbackUrl || '';
  }
};

/**
 * Check if a file exists in a storage bucket
 * @param bucket The storage bucket name
 * @param path Path to the file within the bucket
 * @returns Promise resolving to boolean indicating if file exists
 */
export const checkFileExists = async (
  bucket: string, 
  path: string
): Promise<boolean> => {
  try {
    debugLog(`Checking if file exists: ${path} in ${bucket}`);
    
    if (!bucket || !path) {
      errorLog(`Invalid parameters for checkFileExists: bucket=${bucket}, path=${path}`);
      return false;
    }
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path, { transform: { width: 10, height: 10 } }); // Use transform to minimize download size for checking
    
    const exists = !!data && !error;
    debugLog(`File ${path} exists: ${exists}`);
    
    return exists;
  } catch (error) {
    errorLog(`Error checking if file exists: ${path} in bucket: ${bucket}`, error);
    return false;
  }
};

/**
 * Get multiple file URLs at once
 * @param bucket The storage bucket name
 * @param paths Array of file paths
 * @returns Object mapping paths to their public URLs
 */
export const getBatchFileUrls = (
  bucket: string,
  paths: string[]
): Record<string, string> => {
  try {
    debugLog(`Generating URLs for ${paths.length} files in ${bucket}`);
    
    const result: Record<string, string> = {};
    
    for (const path of paths) {
      const url = getFileUrl(bucket, path);
      if (url) {
        result[path] = url;
      }
    }
    
    return result;
  } catch (error) {
    errorLog(`Error generating batch URLs for bucket: ${bucket}`, error);
    return {};
  }
};

/**
 * Try to get a file URL, falling back to alternative paths if the primary one fails
 * @param bucket The storage bucket name
 * @param primaryPath Primary file path to try
 * @param fallbackPaths Array of fallback paths to try in order
 * @returns The first successful URL or empty string if all fail
 */
export const getFileUrlWithFallbacks = async (
  bucket: string,
  primaryPath: string,
  fallbackPaths: string[] = []
): Promise<string> => {
  try {
    // Try primary path first
    const primaryExists = await checkFileExists(bucket, primaryPath);
    if (primaryExists) {
      return getFileUrl(bucket, primaryPath);
    }
    
    // Try fallbacks in order
    for (const fallbackPath of fallbackPaths) {
      const fallbackExists = await checkFileExists(bucket, fallbackPath);
      if (fallbackExists) {
        debugLog(`Using fallback path: ${fallbackPath}`);
        return getFileUrl(bucket, fallbackPath);
      }
    }
    
    errorLog(`No valid file found at primary or fallback paths`);
    return '';
  } catch (error) {
    errorLog(`Error in getFileUrlWithFallbacks`, error);
    return '';
  }
};
