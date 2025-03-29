
import { supabase } from "@/integrations/supabase/client";
import { bulkUploadProjectImages, getProjectImageUrl } from "./uploadProjectImage";
import { toast } from "sonner";

// List of image URLs from fencing-questions.tsx
const FENCING_IMAGES = [
  'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/fencing/maintenance-repair.png',
  'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/fencing/service-contract.png',
  'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/fencing/construction.png',
  'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/fencing/wood.png',
  'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/fencing/metal.png',
  'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/fencing/vinyl.png',
  'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/fencing/chain-link.png',
  'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/fencing/stone.png',
  'https://eqbbnewrorxilukaocjx.supabase.co/storage/v1/object/public/project_images/fencing/horizontal-wood.png',
];

/**
 * Ensure all category folders exist in the project_images bucket
 */
export const ensureCategoryFolders = async () => {
  const categories = ['fencing', 'roofing', 'landscaping', 'hvac', 'plumbing', 'electrical'];
  
  try {
    for (const category of categories) {
      // Create a placeholder file to ensure the folder exists
      await supabase.storage
        .from('project_images')
        .upload(`${category}/.emptyFolderPlaceholder`, new Blob([''], { type: 'text/plain' }), {
          cacheControl: '3600',
          upsert: true
        });
    }
    return true;
  } catch (error) {
    console.error('Error creating category folders:', error);
    return false;
  }
};

/**
 * Fetch an image from a URL and convert it to a File object
 */
const fetchImageAsFile = async (url: string): Promise<File | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const filename = url.split('/').pop() || 'image.png';
    
    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
};

/**
 * Check if images in Supabase are accessible
 */
export const checkImages = async () => {
  const missingImages = [];
  
  for (const imageUrl of FENCING_IMAGES) {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        missingImages.push(imageUrl);
      }
    } catch (error) {
      missingImages.push(imageUrl);
    }
  }
  
  return {
    allImagesAccessible: missingImages.length === 0,
    missingImages
  };
};

/**
 * Upload images to Supabase that don't already exist
 */
export const migrateImagesToSupabase = async () => {
  try {
    // First ensure all category folders exist
    await ensureCategoryFolders();
    
    // Check if images are already accessible
    const { allImagesAccessible, missingImages } = await checkImages();
    
    if (allImagesAccessible) {
      toast.success('All images are already accessible in Supabase');
      return { success: true, uploadedCount: 0 };
    }
    
    // If some images are missing, let's try to upload them
    toast.info(`Uploading ${missingImages.length} missing images to Supabase...`);
    
    // Create a mapping of demo images to upload
    const demoImages = [
      { name: 'maintenance-repair.png', url: '/images/fencing/maintenance-repair.png' },
      { name: 'service-contract.png', url: '/images/fencing/service-contract.png' },
      { name: 'construction.png', url: '/images/fencing/construction.png' },
      { name: 'wood.png', url: '/images/fencing/wood.png' },
      { name: 'metal.png', url: '/images/fencing/metal.png' },
      { name: 'vinyl.png', url: '/images/fencing/vinyl.png' },
      { name: 'chain-link.png', url: '/images/fencing/chain-link.png' },
      { name: 'stone.png', url: '/images/fencing/stone.png' },
      { name: 'horizontal-wood.png', url: '/images/fencing/horizontal-wood.png' },
    ];
    
    // Fetch all image files
    const files: File[] = [];
    
    for (const image of demoImages) {
      const file = await fetchImageAsFile(image.url);
      if (file) {
        // Rename the file to match the expected name in Supabase
        const renamedFile = new File([file], image.name, { type: file.type });
        files.push(renamedFile);
      }
    }
    
    if (files.length === 0) {
      toast.error('Failed to fetch any images for upload');
      return { success: false, uploadedCount: 0 };
    }
    
    // Upload the files to Supabase
    const uploadedUrls = await bulkUploadProjectImages(files, 'fencing');
    
    toast.success(`Successfully uploaded ${uploadedUrls.length} images to Supabase`);
    return { success: true, uploadedCount: uploadedUrls.length };
  } catch (error) {
    console.error('Error migrating images to Supabase:', error);
    toast.error('Failed to migrate images to Supabase');
    return { success: false, uploadedCount: 0 };
  }
};
