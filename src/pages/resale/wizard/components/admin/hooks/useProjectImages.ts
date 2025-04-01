
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { IMAGE_CATEGORIES } from '../constants/imageCategories';

export interface ImageItem {
  id: string;
  name: string;
  url: string;
  category: string;
  size: number;
  createdAt: string;
}

export const useProjectImages = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [recentUploads, setRecentUploads] = useState<ImageItem[]>([]);
  const [category, setCategory] = useState('fencing');
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      // Fetch images from the project_images bucket for the selected category
      const { data, error } = await supabase
        .storage
        .from('project_images')
        .list(category, {
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        throw error;
      }

      if (data) {
        // Filter out folders and process only files
        const fileData = data.filter(item => !item.id.endsWith('/'));
        
        // Map to ImageItem format
        const imageItems: ImageItem[] = await Promise.all(
          fileData.map(async (file) => {
            const { data: urlData } = supabase.storage
              .from('project_images')
              .getPublicUrl(`${category}/${file.name}`);
              
            return {
              id: file.id,
              name: file.name,
              url: urlData.publicUrl,
              category: category,
              size: file.metadata?.size || 0,
              createdAt: file.created_at || new Date().toISOString()
            };
          })
        );
        
        setImages(imageItems);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load images');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentUploads = async () => {
    setLoading(true);
    try {
      // Fetch recent uploads across all categories
      const recentImages: ImageItem[] = [];
      
      // Loop through each category to get recent uploads
      for (const categoryItem of IMAGE_CATEGORIES) {
        const { data, error } = await supabase
          .storage
          .from('project_images')
          .list(categoryItem.id, {
            limit: 3,
            sortBy: { column: 'created_at', order: 'desc' }
          });
          
        if (error) {
          console.error(`Error fetching ${categoryItem.id} images:`, error);
          continue;
        }
        
        if (data) {
          // Filter out folders and process only files
          const fileData = data.filter(item => !item.id.endsWith('/'));
          
          // Add to recent uploads
          for (const file of fileData) {
            const { data: urlData } = supabase.storage
              .from('project_images')
              .getPublicUrl(`${categoryItem.id}/${file.name}`);
              
            recentImages.push({
              id: file.id,
              name: file.name,
              url: urlData.publicUrl,
              category: categoryItem.id,
              size: file.metadata?.size || 0,
              createdAt: file.created_at || new Date().toISOString()
            });
          }
        }
      }
      
      // Sort by date and limit to 8 most recent
      const sorted = recentImages.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setRecentUploads(sorted.slice(0, 8));
    } catch (error) {
      console.error('Error fetching recent uploads:', error);
      toast.error('Failed to load recent uploads');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      // Find the image to delete
      const imageToDelete = images.find(img => img.id === imageId);
      if (!imageToDelete) {
        throw new Error('Image not found');
      }
      
      // Delete from Supabase storage
      const { error } = await supabase
        .storage
        .from('project_images')
        .remove([`${imageToDelete.category}/${imageToDelete.name}`]);
        
      if (error) {
        throw error;
      }
      
      // Update state
      setImages(prevImages => prevImages.filter(img => img.id !== imageId));
      toast.success('Image deleted successfully');
      return Promise.resolve();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
      return Promise.reject(error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [category]);

  useEffect(() => {
    fetchRecentUploads();
  }, []);

  return {
    images,
    category,
    loading,
    recentUploads,
    setCategory,
    fetchImages,
    fetchRecentUploads,
    handleDeleteImage
  };
};
