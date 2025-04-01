
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Mock data for now - would be replaced with actual API call
export interface ImageItem {
  id: string;
  name: string;
  url: string;
  category: string;
  size: number;
  createdAt: string;
}

const mockImages: ImageItem[] = [
  {
    id: 'img1',
    name: 'fence-installation.jpg',
    url: 'https://images.unsplash.com/photo-1628784231135-e5c22ed4c8a2?q=80&w=2787&auto=format&fit=crop',
    category: 'fencing',
    size: 245678,
    createdAt: '2023-09-15T12:00:00Z'
  },
  {
    id: 'img2',
    name: 'roof-repair.jpg',
    url: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?q=80&w=2940&auto=format&fit=crop',
    category: 'roofing',
    size: 345678,
    createdAt: '2023-09-14T10:30:00Z'
  },
  {
    id: 'img3',
    name: 'garden-design.jpg',
    url: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=2940&auto=format&fit=crop',
    category: 'landscaping',
    size: 445678,
    createdAt: '2023-09-13T09:15:00Z'
  }
];

export const useProjectImages = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [recentUploads, setRecentUploads] = useState<ImageItem[]>([]);
  const [category, setCategory] = useState('fencing');
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      // This would be replaced with an actual API call
      setTimeout(() => {
        const filteredImages = mockImages.filter(img => img.category === category);
        setImages(filteredImages);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to load images');
      setLoading(false);
    }
  };

  const fetchRecentUploads = async () => {
    setLoading(true);
    try {
      // This would be replaced with an actual API call
      setTimeout(() => {
        // Sort by date descending
        const sorted = [...mockImages].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentUploads(sorted.slice(0, 8)); // Get most recent 8
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching recent uploads:', error);
      toast.error('Failed to load recent uploads');
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      // This would be replaced with an actual API call
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
