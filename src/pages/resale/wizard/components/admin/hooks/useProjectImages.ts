
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProjectImage {
  id: string;
  url: string;
  category: string;
  fileName: string;
}

export const useProjectImages = () => {
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [recentUploads, setRecentUploads] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>('all');

  useEffect(() => {
    fetchImages();
    fetchRecentUploads();
  }, []);

  useEffect(() => {
    fetchImages();
  }, [category]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('bid_request_images')
        .select('*');
      
      if (category !== 'all') {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching project images:', error);
        toast.error('Failed to load project images');
        return;
      }
      
      // Get URLs for the images
      const imagesWithUrls = await Promise.all(
        (data || []).map(async (image) => {
          const { data: urlData } = supabase.storage
            .from('bid_request_images')
            .getPublicUrl(image.file_path);
          
          return {
            id: image.id,
            url: urlData.publicUrl,
            category: image.category || 'uncategorized',
            fileName: image.file_name
          };
        })
      );
      
      setImages(imagesWithUrls);
    } catch (error) {
      console.error('Error in fetchImages:', error);
      toast.error('An error occurred while loading images');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentUploads = async () => {
    try {
      const { data, error } = await supabase
        .from('bid_request_images')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(12);
      
      if (error) {
        console.error('Error fetching recent uploads:', error);
        return;
      }
      
      // Get URLs for the images
      const recentWithUrls = await Promise.all(
        (data || []).map(async (image) => {
          const { data: urlData } = supabase.storage
            .from('bid_request_images')
            .getPublicUrl(image.file_path);
          
          return {
            id: image.id,
            url: urlData.publicUrl,
            category: image.category || 'uncategorized',
            fileName: image.file_name
          };
        })
      );
      
      setRecentUploads(recentWithUrls);
    } catch (error) {
      console.error('Error in fetchRecentUploads:', error);
    }
  };

  const handleDeleteImage = async (imageId: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('bid_request_images')
        .remove([filePath]);
      
      if (storageError) {
        console.error('Error deleting image from storage:', storageError);
        toast.error('Failed to delete image from storage');
        return;
      }
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('bid_request_images')
        .delete()
        .eq('id', imageId);
      
      if (dbError) {
        console.error('Error deleting image from database:', dbError);
        toast.error('Failed to delete image record');
        return;
      }
      
      toast.success('Image deleted successfully');
      
      // Refresh images
      fetchImages();
      fetchRecentUploads();
    } catch (error) {
      console.error('Error in handleDeleteImage:', error);
      toast.error('An error occurred while deleting the image');
    }
  };

  return {
    images,
    recentUploads,
    loading,
    category,
    setCategory,
    fetchImages,
    fetchRecentUploads,
    handleDeleteImage
  };
};
