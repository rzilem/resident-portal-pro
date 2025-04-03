
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { errorLog, infoLog } from "@/utils/debug";
import { ensureDocumentsBucketExists } from "@/utils/documents/bucketUtils";

/**
 * Generic file upload utility for Supabase storage
 * @param file The file to upload
 * @param bucket The storage bucket name
 * @param path The path within the bucket
 * @param options Additional upload options
 * @returns URL of the uploaded file or null if upload failed
 */
export const uploadFile = async (
  file: File, 
  bucket: string,
  path: string = '',
  options: {
    cacheControl?: string;
    upsert?: boolean;
    contentType?: string;
    useDemo?: boolean;
  } = {}
): Promise<string | null> => {
  try {
    // Validate file
    if (!file) {
      toast.error('No file provided');
      return null;
    }
    
    infoLog(`Uploading file: ${file.name} to ${bucket}/${path}`);
    
    // Create a unique filename that includes the original extension
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}-${randomString}-${file.name.split('.')[0]}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;
    
    // First ensure the bucket exists
    const bucketExists = await ensureBucketExists(bucket);
    if (!bucketExists) {
      errorLog(`Bucket ${bucket} does not exist and could not be created`);
      toast.error('Storage unavailable. Please contact system administrator.');
      return null;
    }
    
    // Upload to Supabase with better error handling
    infoLog(`Uploading to path: ${filePath}`);
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: options.cacheControl || '3600',
        upsert: options.upsert !== undefined ? options.upsert : true,
        contentType: options.contentType || file.type
      });
    
    if (error) {
      errorLog(`Error uploading file to ${bucket}:`, error);
      
      // Handle specific errors
      if (error.message.includes('storage.objects') || 
          error.message.includes('row-level security policy')) {
        toast.error('Permission denied: You may not have access to upload files.');
        return null;
      }
      
      toast.error(`Upload failed: ${error.message}`);
      return null;
    }
    
    if (!data) {
      errorLog('No data returned from upload but no error');
      toast.error('Upload failed for unknown reason');
      return null;
    }
    
    infoLog('File uploaded successfully to path:', data.path);
    
    // Get public URL with a cache busting parameter
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    if (!publicUrlData || !publicUrlData.publicUrl) {
      errorLog('Failed to get public URL for uploaded file');
      toast.error('Failed to generate public URL for uploaded file');
      return null;
    }
    
    // Add a version parameter to prevent caching issues
    const publicUrl = publicUrlData.publicUrl;
    
    infoLog('Generated public URL:', publicUrl);
    
    return publicUrl;
  } catch (error) {
    errorLog(`Exception in uploadFile to ${bucket}:`, error);
    toast.error('An unexpected error occurred while uploading the file');
    return null;
  }
};

/**
 * Helper function to ensure a bucket exists
 * @param bucketName Name of the bucket to check/create
 * @returns Boolean indicating if bucket exists or was created
 */
async function ensureBucketExists(bucketName: string): Promise<boolean> {
  try {
    // Check if bucket exists
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      // If we can't list buckets, we'll assume it exists
      infoLog('Unable to list buckets, will attempt upload anyway');
      return true;
    } 
    
    const bucketExists = buckets.some(b => b.name === bucketName);
    
    if (!bucketExists) {
      infoLog(`Bucket ${bucketName} not found, attempting to create...`);
      try {
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true // Make bucket public to ensure files are accessible
        });
        
        if (createError) {
          // If we can't create the bucket, log and continue
          infoLog(`Could not create bucket ${bucketName}: ${createError.message}`);
          return false;
        } else {
          infoLog(`Created bucket ${bucketName} successfully`);
          return true;
        }
      } catch (bucketError) {
        infoLog('Error creating bucket:', bucketError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    errorLog('Exception checking/creating bucket:', error);
    return false;
  }
}
