
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
  } = {}
): Promise<string | null> => {
  try {
    // Validate file
    if (!file) {
      toast.error('No file provided');
      return null;
    }
    
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${file.name.split('.')[0]}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;
    
    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: options.cacheControl || '3600',
        upsert: options.upsert !== undefined ? options.upsert : true,
        contentType: options.contentType || file.type
      });
    
    if (error) {
      // If bucket doesn't exist, try to create it (for development/demo purposes)
      if (error.message.includes('bucket') && error.message.includes('not found')) {
        console.log(`Bucket ${bucket} not found, attempting to create...`);
        try {
          // In a real implementation, you'd have a proper bucket creation flow
          // This is simplified for demo purposes
          toast.warning(`Storage bucket "${bucket}" may need to be created in your Supabase dashboard`);
        } catch (bucketError) {
          console.error('Error creating bucket:', bucketError);
        }
      }
      
      errorLog(`Error uploading file to ${bucket}:`, error);
      toast.error('Failed to upload file');
      return null;
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    errorLog(`Exception in uploadFile to ${bucket}:`, error);
    toast.error('An unexpected error occurred while uploading the file');
    return null;
  }
};
