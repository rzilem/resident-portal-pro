
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { errorLog } from "@/utils/debug";

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
    
    console.log(`Uploading file: ${file.name} to ${bucket}/${path}`);
    
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${file.name.split('.')[0]}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;
    
    // Check if bucket exists first to prevent errors
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      errorLog(`Error checking storage buckets:`, bucketError);
      toast.error('Error accessing storage buckets');
      return null;
    }
    
    const bucketExists = buckets.some(b => b.name === bucket);
    
    if (!bucketExists) {
      console.log(`Bucket ${bucket} not found, attempting to create...`);
      try {
        const { error: createError } = await supabase.storage.createBucket(bucket, {
          public: true // Make bucket public to ensure images are accessible
        });
        
        if (createError) {
          errorLog(`Error creating bucket ${bucket}:`, createError);
          toast.error(`Could not create storage bucket: ${createError.message}`);
          return null;
        } else {
          console.log(`Created bucket ${bucket} successfully`);
        }
      } catch (bucketError) {
        console.error('Error creating bucket:', bucketError);
        toast.error('Failed to create storage bucket');
        return null;
      }
    }
    
    // Upload to Supabase
    console.log(`Uploading to path: ${filePath}`);
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: options.cacheControl || '3600',
        upsert: options.upsert !== undefined ? options.upsert : true,
        contentType: options.contentType || file.type
      });
    
    if (error) {
      errorLog(`Error uploading file to ${bucket}:`, error);
      toast.error(`Upload failed: ${error.message}`);
      return null;
    }
    
    console.log('File uploaded successfully to path:', data.path);
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    console.log('Generated public URL:', publicUrlData.publicUrl);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    errorLog(`Exception in uploadFile to ${bucket}:`, error);
    toast.error('An unexpected error occurred while uploading the file');
    return null;
  }
};
