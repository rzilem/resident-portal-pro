
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export type ImageItem = {
  name: string;
  url: string;
  size: number;
  createdAt: string;
};

export const useProjectImages = (initialCategory = 'fencing') => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [category, setCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(false);
  const [recentUploads, setRecentUploads] = useState<ImageItem[]>([]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      // Fetch all images from the project_images bucket
      const { data, error } = await supabase.storage
        .from('project_images')
        .list(category, {
          sortBy: { column: 'created_at', order: 'desc' }
        });
      
      if (error) {
        throw error;
      }

      // Get URLs for each image
      if (data) {
        const imageList = await Promise.all(
          data
            .filter(file => file.name !== '.emptyFolderPlaceholder')
            .map(async (file) => {
              const { data: urlData } = supabase.storage
                .from('project_images')
                .getPublicUrl(`${category}/${file.name}`);
              
              return {
                name: file.name,
                url: urlData.publicUrl,
                size: file.metadata?.size || 0,
                createdAt: file.created_at || new Date().toISOString()
              };
            })
        );
        
        setImages(imageList);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentUploads = async () => {
    setLoading(true);
    try {
      // Calculate timestamp for 30 minutes ago
      const thirtyMinutesAgo = new Date();
      thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);
      
      // Fetch all folders first
      const { data: folders } = await supabase.storage
        .from('project_images')
        .list();
      
      if (!folders) {
        return;
      }
      
      // For each folder, get files and filter for recent ones
      const allRecentFiles = [];
      
      for (const folder of folders) {
        if (folder.id) { // id property indicates it's a folder
          const { data: files } = await supabase.storage
            .from('project_images')
            .list(folder.name);
            
          if (files) {
            for (const file of files) {
              if (file.created_at && new Date(file.created_at) > thirtyMinutesAgo) {
                const { data: urlData } = supabase.storage
                  .from('project_images')
                  .getPublicUrl(`${folder.name}/${file.name}`);
                
                allRecentFiles.push({
                  name: file.name,
                  url: urlData.publicUrl,
                  size: file.metadata?.size || 0,
                  createdAt: file.created_at
                });
              }
            }
          }
        }
      }
      
      setRecentUploads(allRecentFiles);
    } catch (error) {
      console.error('Error fetching recent uploads:', error);
      toast.error('Failed to fetch recent uploads');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageName: string) => {
    try {
      const { error } = await supabase.storage
        .from('project_images')
        .remove([`${category}/${imageName}`]);
      
      if (error) {
        throw error;
      }
      
      toast.success('Image deleted successfully');
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  useEffect(() => {
    fetchImages();
    fetchRecentUploads();
  }, [category]);

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
