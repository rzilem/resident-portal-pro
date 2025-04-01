
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ImageItem {
  id: string;
  url: string;
  category: string;
  name: string;
  size: number;
  createdAt: string;
}

export const useProjectImages = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [recentUploads, setRecentUploads] = useState<ImageItem[]>([]);
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
            name: image.file_name,
            size: image.file_size || 0,
            createdAt: image.created_at
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
            name: image.file_name,
            size: image.file_size || 0,
            createdAt: image.created_at
          };
        })
      );
      
      setRecentUploads(recentWithUrls);
    } catch (error) {
      console.error('Error in fetchRecentUploads:', error);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      // Get the file path first
      const { data: imageData, error: fetchError } = await supabase
        .from('bid_request_images')
        .select('file_path')
        .eq('id', imageId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching image data:', fetchError);
        toast.error('Failed to find image metadata');
        return;
      }
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('bid_request_images')
        .remove([imageData.file_path]);
      
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
