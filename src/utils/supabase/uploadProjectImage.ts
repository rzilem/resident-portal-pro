
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Upload an image to the project_images bucket
 * @param file The file to upload
 * @param path Optional path within the bucket
 * @returns URL of the uploaded image or null if upload failed
 */
export const uploadProjectImage = async (
  file: File, 
  path: string = 'fencing'
): Promise<string | null> => {
  try {
    // Validate file
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Invalid file type. Please upload an image.');
      return null;
    }
    
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${file.name.split('.')[0]}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;
    
    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from('project_images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('project_images')
      .getPublicUrl(data.path);
    
    toast.success('Image uploaded successfully');
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Exception in uploadProjectImage:', error);
    toast.error('An unexpected error occurred while uploading the image');
    return null;
  }
};

/**
 * Get the public URL for an image in the project_images bucket
 * @param path Path to the image within the bucket
 * @returns Public URL of the image
 */
export const getProjectImageUrl = (path: string): string => {
  const { data } = supabase.storage
    .from('project_images')
    .getPublicUrl(path);
  
  return data.publicUrl;
};
