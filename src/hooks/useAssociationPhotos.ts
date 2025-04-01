
import { useState, useEffect, useCallback } from 'react';
import { 
  getAssociationPhotos, 
  uploadAssociationPhoto, 
  deleteAssociationPhoto, 
  setPrimaryPhoto,
  AssociationPhoto
} from '@/services/associationPhotoService';

export const useAssociationPhotos = (associationId: string) => {
  const [photos, setPhotos] = useState<AssociationPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = useCallback(async () => {
    if (!associationId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching photos for association: ${associationId}`);
      const data = await getAssociationPhotos(associationId);
      console.log(`Fetched ${data.length} photos`, data);
      setPhotos(data);
    } catch (err) {
      console.error('Error fetching association photos:', err);
      setError('Failed to load association photos');
    } finally {
      setIsLoading(false);
    }
  }, [associationId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const uploadPhoto = useCallback(async (file: File, description?: string) => {
    if (!associationId) return null;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const newPhoto = await uploadAssociationPhoto(associationId, file, description);
      if (newPhoto) {
        setPhotos(prev => [newPhoto, ...prev]);
        return newPhoto;
      }
      return null;
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError('Failed to upload photo');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [associationId]);

  const deletePhoto = useCallback(async (photoId: string) => {
    setError(null);
    
    try {
      const success = await deleteAssociationPhoto(photoId);
      if (success) {
        setPhotos(prev => prev.filter(photo => photo.id !== photoId));
      }
      return success;
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError('Failed to delete photo');
      return false;
    }
  }, []);

  const setPrimary = useCallback(async (photoId: string) => {
    if (!associationId) return false;
    
    setError(null);
    
    try {
      const success = await setPrimaryPhoto(photoId, associationId);
      if (success) {
        setPhotos(prev => prev.map(photo => ({
          ...photo,
          is_primary: photo.id === photoId
        })));
      }
      return success;
    } catch (err) {
      console.error('Error setting primary photo:', err);
      setError('Failed to update primary photo');
      return false;
    }
  }, [associationId]);

  return {
    photos,
    isLoading,
    isUploading,
    error,
    uploadPhoto,
    deletePhoto,
    setPrimary,
    refreshPhotos: fetchPhotos
  };
};
