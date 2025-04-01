
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
      const data = await getAssociationPhotos(associationId);
      setPhotos(data);
    } catch (err) {
      setError('Failed to load association photos');
      console.error(err);
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
      setError('Failed to upload photo');
      console.error(err);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [associationId]);

  const deletePhoto = useCallback(async (photoId: string) => {
    setError(null);
    
    const success = await deleteAssociationPhoto(photoId);
    if (success) {
      setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    }
    
    return success;
  }, []);

  const setPrimary = useCallback(async (photoId: string) => {
    if (!associationId) return false;
    
    setError(null);
    
    const success = await setPrimaryPhoto(photoId, associationId);
    if (success) {
      setPhotos(prev => prev.map(photo => ({
        ...photo,
        is_primary: photo.id === photoId
      })));
    }
    
    return success;
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
