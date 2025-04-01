import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a project image to the bid_request_images bucket
 * @param file The image file to upload
 * @param category The category of the image (e.g., 'fencing', 'roofing')
 * @returns URL of the uploaded image or null if upload failed
 */
export const uploadProjectImage = async (
  file: File,
  category: string = 'general'
): Promise<string | null> => {
  try {
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File size exceeds 10MB limit`);
      return null;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return null;
    }
    
    // Get user ID for folder structure
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user.id;
    
    if (!userId) {
      toast.error('You must be logged in to upload images');
      return null;
    }
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${userId}/${category}/${fileName}`;
    
    // Show upload toast
    toast.loading('Uploading image...');
    
    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from('bid_request_images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading image:', error);
      toast.dismiss();
      toast.error(`Upload failed: ${error.message}`);
      return null;
    }
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('bid_request_images')
      .getPublicUrl(data.path);
    
    // Dismiss loading toast and show success
    toast.dismiss();
    toast.success('Image uploaded successfully');
    
    // Store image metadata in the database
    try {
      await supabase.from('bid_request_images').insert({
        file_path: data.path,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        created_by: userId,
        category: category,
        bid_request_id: '00000000-0000-0000-0000-000000000000' // This will be updated later when the bid request is created
      });
    } catch (dbError) {
      console.error('Error storing image metadata:', dbError);
      // Continue anyway since the image upload succeeded
    }
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadProjectImage:', error);
    toast.dismiss();
    toast.error('An unexpected error occurred');
    return null;
  }
};

/**
 * Saves image metadata to the bid_request_images table
 * @param imageUrl URL of the uploaded image
 * @param bidRequestId ID of the bid request
 */
export const associateImageWithBidRequest = async (
  imageUrl: string,
  bidRequestId: string
): Promise<boolean> => {
  try {
    // Extract the file path from the URL
    const urlObj = new URL(imageUrl);
    const pathParts = urlObj.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf('bid_request_images') + 1).join('/');
    
    // Find the image record by file path
    const { data, error } = await supabase
      .from('bid_request_images')
      .update({ bid_request_id: bidRequestId })
      .eq('file_path', filePath);
    
    if (error) {
      console.error('Error associating image with bid request:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in associateImageWithBidRequest:', error);
    return false;
  }
};

/**
 * Gets the public URL for a project image
 * @param path The path to the image in the storage bucket
 * @returns Public URL of the image
 */
export const getProjectImageUrl = (path: string): string => {
  if (!path) return '';
  
  try {
    const { data } = supabase.storage
      .from('bid_request_images')
      .getPublicUrl(path);
      
    return data.publicUrl;
  } catch (error) {
    console.error('Error getting project image URL:', error);
    return '';
  }
};
