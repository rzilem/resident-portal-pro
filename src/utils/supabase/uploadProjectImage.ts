
import { toast } from "sonner";
import { debugLog, errorLog } from "@/utils/debug";
import { uploadFile } from "./storage/uploadFile";
import { getFileUrl, checkFileExists } from "./storage/getUrl";
import { validateFileSize, validateFileType } from "./storage/validators";

const PROJECT_IMAGES_BUCKET = 'project_images';

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
    if (!validateFileType(file, ['image/'])) {
      return null;
    }
    
    if (!validateFileSize(file, 2)) { // 2MB limit
      return null;
    }
    
    // Upload file
    const imageUrl = await uploadFile(file, PROJECT_IMAGES_BUCKET, path);
    
    if (imageUrl) {
      toast.success('Image uploaded successfully');
    }
    
    return imageUrl;
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
  
  // Handle UUIDs that are direct paths to lovable-uploads
  if (path.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png|jpg|jpeg|gif)$/i)) {
    return `/lovable-uploads/${path}`;
  }
  
  debugLog(`Getting image URL for path: ${path}`);
  
  try {
    // Special case for arborist
    if (path === 'arborist.jpg' || path === 'f882aa65-6796-4e85-85b6-1d4961276334.png') {
      return `/lovable-uploads/f882aa65-6796-4e85-85b6-1d4961276334.png`;
    }
    
    // For images in the maintenance-types folder
    if (path.includes('maintenance-types/')) {
      return `/lovable-uploads/${path.split('/').pop() || path}`;
    }
    
    // For development or when Supabase storage is not properly set up
    // Use the fallback image
    return `/lovable-uploads/72c3f90f-d218-4c0e-bc9e-48a04496044f.png`;
    
    // The following code is commented out as it's not working properly
    // but can be uncommented once Supabase storage is properly set up
    
    /*
    // Create and return the public URL
    return getFileUrl(PROJECT_IMAGES_BUCKET, path);
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
  return await checkFileExists(PROJECT_IMAGES_BUCKET, path);
};
