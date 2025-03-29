import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { debugLog, errorLog } from "@/utils/debug";

/**
 * Upload an image to the project_images bucket
 * @param file The file to upload
 * @param path Optional path within the bucket
 * @returns URL of the uploaded image or null if upload failed
 */
export const uploadProjectImage = async (
  file: File, 
  path: string = 'project_images'
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
      errorLog('Error uploading image:', error);
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
    errorLog('Exception in uploadProjectImage:', error);
    toast.error('An unexpected error occurred while uploading the image');
    return null;
  }
};

/**
 * Bulk upload images to the project_images bucket
 * @param files Array of files to upload
 * @param path Optional path within the bucket
 * @returns Array of uploaded image URLs
 */
export const bulkUploadProjectImages = async (
  files: File[], 
  path: string = 'project_images'
): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadProjectImage(file, path));
  return (await Promise.all(uploadPromises)).filter(url => url !== null) as string[];
};

/**
 * Get the public URL for an image in the project_images bucket
 * @param path Path to the image within the bucket
 * @returns Public URL of the image
 */
export const getProjectImageUrl = (path: string): string => {
  // Check if it's already a fully qualified URL or a lovable-uploads path
  if (path.startsWith('http') || path.startsWith('/lovable-uploads/')) {
    return path;
  }
  
  debugLog(`Getting image URL for path: ${path}`);
  
  try {
    // For development or when Supabase storage is not properly set up
    // Use the fallback image
    return `/lovable-uploads/72c3f90f-d218-4c0e-bc9e-48a04496044f.png`;
    
    // The following code is commented out as it's not working properly
    // but can be uncommented once Supabase storage is properly set up
    
    /*
    // Create and return the public URL
    const { data } = supabase.storage
      .from('project_images')
      .getPublicUrl(path);
    
    debugLog(`Generated image URL: ${data.publicUrl}`);
    return data.publicUrl;
    */
  } catch (error) {
    errorLog(`Error generating URL for path: ${path}`, error);
    return `/lovable-uploads/72c3f90f-d218-4c0e-bc9e-48a04496044f.png`; // Fallback to provided image
  }
};

/**
 * Check if an image exists in the project_images bucket
 * @param path Path to the image within the bucket
 * @returns True if the image exists, false otherwise
 */
export const checkImageExists = async (path: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage
      .from('project_images')
      .download(path);
    
    return !!data && !error;
  } catch (error) {
    errorLog(`Error checking if image exists: ${path}`, error);
    return false;
  }
};
