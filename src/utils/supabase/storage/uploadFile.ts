
import { supabase } from '@/integrations/supabase/client';
import { errorLog, infoLog } from '@/utils/debug';
import { v4 as uuidv4 } from 'uuid';
import { validateFileSize, validateFileType } from './validators';

interface UploadFileOptions {
  maxSize?: number; // Max size in MB
  allowedTypes?: string[];
  path?: string;
  cacheControl?: string;
  upsert?: boolean;
}

/**
 * Uploads a file to Supabase storage
 * @param file The file to upload
 * @param bucket The bucket to upload to
 * @param folder Optional folder within the bucket
 * @param options Upload options
 * @returns The URL of the uploaded file, or null if upload failed
 */
export const uploadFile = async (
  file: File,
  bucket: string,
  folder?: string,
  options?: UploadFileOptions
): Promise<string | null> => {
  const {
    maxSize = 10, // Default 10MB
    allowedTypes,
    path,
    cacheControl = '3600',
    upsert = false
  } = options || {};
  
  try {
    infoLog(`Starting file upload to bucket: ${bucket}, folder: ${folder || 'root'}`);
    
    // Validate file size
    if (!validateFileSize(file, maxSize)) {
      errorLog(`File size exceeds maximum of ${maxSize}MB`);
      return null;
    }
    
    // Validate file type if allowedTypes is provided
    if (allowedTypes && !validateFileType(file, allowedTypes)) {
      errorLog('File type not allowed');
      return null;
    }
    
    // Check if a path is provided, otherwise generate one
    let uploadPath: string;
    if (path) {
      uploadPath = path;
    } else {
      // Generate a unique file path
      const uniqueId = uuidv4();
      const fileExtension = file.name.split('.').pop() || '';
      const fileName = `${uniqueId}.${fileExtension}`;
      
      uploadPath = folder 
        ? `${folder}/${fileName}`
        : fileName;
    }
    
    infoLog(`Uploading file to path: ${uploadPath}`);
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(uploadPath, file, {
        cacheControl,
        upsert
      });
    
    if (error) {
      errorLog('Error uploading file:', error);
      return null;
    }
    
    // Get the public URL
    const { data: urlData } = await supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    const publicUrl = urlData?.publicUrl || null;
    infoLog(`File uploaded successfully. Public URL: ${publicUrl}`);
    
    return publicUrl;
  } catch (error) {
    errorLog('Unexpected error during file upload:', error);
    return null;
  }
};
