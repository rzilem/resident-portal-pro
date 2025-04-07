
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ensureBucketExists, StorageBucket } from './bucketManager';

interface UploadOptions {
  /**
   * The maximum file size in MB
   */
  maxSizeMB?: number;
  
  /**
   * Array of allowed MIME types
   */
  allowedTypes?: string[];
  
  /**
   * The path within the bucket (not including filename)
   */
  path?: string;
  
  /**
   * Whether to make the file publicly accessible
   */
  public?: boolean;
  
  /**
   * Custom filename to use (if not provided, original filename is used)
   */
  customFilename?: string;
  
  /**
   * Additional metadata to store with the file
   */
  metadata?: Record<string, string>;
}

interface UploadResult {
  /**
   * Whether the upload was successful
   */
  success: boolean;
  
  /**
   * The path to the file in storage
   */
  path: string;
  
  /**
   * The public URL to the file
   */
  url: string;
  
  /**
   * The file size in bytes
   */
  size: number;
  
  /**
   * The MIME type of the file
   */
  type: string;
  
  /**
   * The original filename
   */
  name: string;
  
  /**
   * Any error that occurred during upload
   */
  error?: string;
}

/**
 * Upload a file to Supabase storage
 * @param file The file to upload
 * @param bucketName The bucket to upload to
 * @param options Upload options
 * @returns Promise with the upload result
 */
export const uploadFile = async (
  file: File,
  bucketName: StorageBucket,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  const result: UploadResult = {
    success: false,
    path: '',
    url: '',
    size: file.size,
    type: file.type,
    name: file.name,
  };
  
  try {
    // Validate file size
    const maxSize = (options.maxSizeMB || 10) * 1024 * 1024; // Convert to bytes
    if (file.size > maxSize) {
      const error = `File size exceeds ${options.maxSizeMB || 10}MB limit`;
      toast.error(error);
      return { ...result, error };
    }
    
    // Validate file type if specified
    if (options.allowedTypes && options.allowedTypes.length > 0) {
      if (!options.allowedTypes.includes(file.type)) {
        const error = `Invalid file type. Allowed types: ${options.allowedTypes.join(', ')}`;
        toast.error(error);
        return { ...result, error };
      }
    }
    
    // Ensure bucket exists
    const bucketExists = await ensureBucketExists(bucketName);
    if (!bucketExists) {
      const error = `Storage bucket ${bucketName} is not available`;
      toast.error(error);
      return { ...result, error };
    }
    
    // Generate a unique file path
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const baseName = options.customFilename || file.name.replace(`.${fileExt}`, '').replace(/\s+/g, '-');
    const fileName = `${baseName}-${timestamp}.${fileExt}`;
    
    // Build the full path
    const folderPath = options.path ? options.path.replace(/^\/+|\/+$/g, '') + '/' : '';
    const fullPath = `${folderPath}${fileName}`;
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
        ...(options.metadata ? { metadata: options.metadata } : {})
      });
    
    if (error) {
      console.error(`Error uploading file to ${bucketName}:`, error);
      toast.error(`File upload failed: ${error.message}`);
      return { ...result, error: error.message };
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data!.path);
    
    console.log(`File uploaded successfully to ${bucketName}:`, urlData.publicUrl);
    
    return {
      success: true,
      path: data!.path,
      url: urlData.publicUrl,
      size: file.size,
      type: file.type,
      name: file.name,
    };
  } catch (error: any) {
    console.error(`Exception during file upload to ${bucketName}:`, error);
    toast.error('An unexpected error occurred during file upload');
    return { ...result, error: error.message || 'Unknown error' };
  }
};

/**
 * Download a file from Supabase storage
 * @param path The path to the file
 * @param bucketName The bucket where the file is stored
 * @returns Promise with the downloaded file
 */
export const downloadFile = async (
  path: string,
  bucketName: StorageBucket
): Promise<Blob | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(path);
    
    if (error) {
      console.error(`Error downloading file from ${bucketName}:`, error);
      toast.error(`File download failed: ${error.message}`);
      return null;
    }
    
    return data;
  } catch (error: any) {
    console.error(`Exception during file download from ${bucketName}:`, error);
    toast.error('An unexpected error occurred during file download');
    return null;
  }
};

/**
 * Delete a file from Supabase storage
 * @param path The path to the file
 * @param bucketName The bucket where the file is stored
 * @returns Promise resolving to success status
 */
export const deleteFile = async (
  path: string,
  bucketName: StorageBucket
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([path]);
    
    if (error) {
      console.error(`Error deleting file from ${bucketName}:`, error);
      toast.error(`File deletion failed: ${error.message}`);
      return false;
    }
    
    console.log(`File deleted successfully from ${bucketName}: ${path}`);
    return true;
  } catch (error: any) {
    console.error(`Exception during file deletion from ${bucketName}:`, error);
    toast.error('An unexpected error occurred during file deletion');
    return false;
  }
};
