
import { supabase } from '@/integrations/supabase/client';
import { uploadProjectImage } from './uploadProjectImage';

const SAMPLE_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1605146768851-eda79da39897?q=80&w=1000',
    category: 'fencing',
    name: 'wooden-fence.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1618764400608-9e7115eede74?q=80&w=1000',
    category: 'roofing',
    name: 'metal-roof.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000',
    category: 'painting',
    name: 'house-painting.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1604096323185-d96289e1055c?q=80&w=1000',
    category: 'landscaping',
    name: 'garden-landscaping.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1000',
    category: 'plumbing',
    name: 'plumbing-work.jpg'
  }
];

/**
 * Migrate sample images to Supabase storage
 */
export const migrateImagesToSupabase = async (): Promise<{ 
  success: boolean; 
  uploadedCount: number;
  errors?: string[];
}> => {
  const errors: string[] = [];
  let uploadedCount = 0;
  
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      return {
        success: false,
        uploadedCount: 0,
        errors: ['User not authenticated. Please log in to migrate images.']
      };
    }
    
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'bid_request_images');
    
    if (!bucketExists) {
      return {
        success: false,
        uploadedCount: 0,
        errors: ['The bid_request_images bucket does not exist. Please run the SQL migration first.']
      };
    }
    
    // Check existing images
    const { data: existingImages } = await supabase.storage
      .from('bid_request_images')
      .list(session.session.user.id);
    
    const existingImageNames = existingImages
      ?.filter(item => !item.id.endsWith('/'))
      ?.map(item => item.name) || [];
    
    // Process each sample image
    for (const image of SAMPLE_IMAGES) {
      // Check if image exists
      if (existingImageNames.some(name => name.includes(image.name.split('.')[0]))) {
        console.log(`Image ${image.name} already exists, skipping...`);
        continue;
      }
      
      try {
        // Fetch the image
        const response = await fetch(image.url);
        const blob = await response.blob();
        
        // Create a File object
        const file = new File([blob], image.name, { type: blob.type });
        
        // Upload to Supabase
        const imageUrl = await uploadProjectImage(file, image.category);
        
        if (imageUrl) {
          uploadedCount++;
        } else {
          errors.push(`Failed to upload ${image.name}`);
        }
      } catch (error) {
        console.error(`Error uploading ${image.name}:`, error);
        errors.push(`Error processing ${image.name}: ${error}`);
      }
    }
    
    return {
      success: errors.length === 0,
      uploadedCount,
      errors: errors.length > 0 ? errors : undefined
    };
  } catch (error) {
    console.error('Error in migrateImagesToSupabase:', error);
    return {
      success: false,
      uploadedCount,
      errors: [`Unexpected error: ${error}`]
    };
  }
};

/**
 * Check if images are accessible in Supabase
 */
export const checkImages = async (): Promise<{
  allImagesAccessible: boolean;
  missingImages: string[];
}> => {
  const missingImages: string[] = [];
  
  try {
    // Check bucket exists
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('Error checking buckets:', bucketError);
      return {
        allImagesAccessible: false,
        missingImages: ['Error checking storage buckets']
      };
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'bid_request_images');
    
    if (!bucketExists) {
      return {
        allImagesAccessible: false,
        missingImages: ['The bid_request_images bucket does not exist']
      };
    }
    
    // Get images from the database
    const { data: imageRecords, error: imageError } = await supabase
      .from('bid_request_images')
      .select('file_path, file_name');
    
    if (imageError) {
      console.error('Error fetching image records:', imageError);
      return {
        allImagesAccessible: false,
        missingImages: ['Error fetching image records from database']
      };
    }
    
    if (!imageRecords || imageRecords.length === 0) {
      // No images to check
      return {
        allImagesAccessible: true,
        missingImages: []
      };
    }
    
    // Check each image
    for (const record of imageRecords) {
      try {
        const { data } = await supabase.storage
          .from('bid_request_images')
          .createSignedUrl(record.file_path, 60);
        
        if (!data || !data.signedUrl) {
          missingImages.push(record.file_name);
        }
      } catch (error) {
        console.error(`Error checking image ${record.file_name}:`, error);
        missingImages.push(record.file_name);
      }
    }
    
    return {
      allImagesAccessible: missingImages.length === 0,
      missingImages
    };
  } catch (error) {
    console.error('Error in checkImages:', error);
    return {
      allImagesAccessible: false,
      missingImages: [`Unexpected error: ${error}`]
    };
  }
};
