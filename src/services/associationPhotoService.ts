
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { uploadFile } from '@/utils/supabase/storage/uploadFile';

export interface AssociationPhoto {
  id: string;
  association_id: string;
  url: string;
  file_name: string;
  file_size: number;
  file_type: string;
  is_primary: boolean;
  description?: string;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Upload a photo for an association
 * @param associationId Association ID
 * @param file File to upload
 * @param description Optional description
 * @returns The uploaded photo object or null if failed
 */
export const uploadAssociationPhoto = async (
  associationId: string,
  file: File,
  description?: string
): Promise<AssociationPhoto | null> => {
  try {
    // First upload the file to storage
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = `${associationId}/${fileName}`;
    
    const fileUrl = await uploadFile(
      file, 
      'association_photos',
      filePath
    );
    
    if (!fileUrl) {
      throw new Error('Failed to upload file');
    }
    
    // Then store the reference in the database
    const { data: photo, error } = await supabase
      .from('association_photos')
      .insert({
        association_id: associationId,
        url: fileUrl,
        file_name: fileName,
        file_size: file.size,
        file_type: file.type,
        description: description || null
      })
      .select('*')
      .single();
    
    if (error) throw error;
    
    toast.success('Photo uploaded successfully');
    return photo;
  } catch (error) {
    console.error('Error uploading association photo:', error);
    toast.error('Failed to upload photo');
    return null;
  }
};

/**
 * Get all photos for an association
 * @param associationId Association ID
 * @returns Array of association photos
 */
export const getAssociationPhotos = async (
  associationId: string
): Promise<AssociationPhoto[]> => {
  try {
    const { data, error } = await supabase
      .from('association_photos')
      .select('*')
      .eq('association_id', associationId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching association photos:', error);
    toast.error('Failed to load association photos');
    return [];
  }
};

/**
 * Delete an association photo
 * @param photoId Photo ID to delete
 * @returns True if successful, false otherwise
 */
export const deleteAssociationPhoto = async (photoId: string): Promise<boolean> => {
  try {
    // First get the photo to know the file path
    const { data: photo, error: fetchError } = await supabase
      .from('association_photos')
      .select('*')
      .eq('id', photoId)
      .single();
    
    if (fetchError || !photo) {
      throw new Error('Photo not found');
    }
    
    // Delete from database
    const { error: deleteError } = await supabase
      .from('association_photos')
      .delete()
      .eq('id', photoId);
    
    if (deleteError) throw deleteError;
    
    // Extract path from URL
    const pathMatch = photo.url.match(/association_photos\/(.+)$/);
    if (pathMatch && pathMatch[1]) {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('association_photos')
        .remove([pathMatch[1]]);
      
      if (storageError) {
        console.warn('Failed to delete file from storage:', storageError);
      }
    }
    
    toast.success('Photo deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting association photo:', error);
    toast.error('Failed to delete photo');
    return false;
  }
};

/**
 * Set a photo as the primary photo for an association
 * @param photoId Photo ID to set as primary
 * @param associationId Association ID
 * @returns True if successful, false otherwise
 */
export const setPrimaryPhoto = async (
  photoId: string,
  associationId: string
): Promise<boolean> => {
  try {
    // First, set all photos to non-primary
    const { error: resetError } = await supabase
      .from('association_photos')
      .update({ is_primary: false })
      .eq('association_id', associationId);
    
    if (resetError) throw resetError;
    
    // Then set the selected photo as primary
    const { error: updateError } = await supabase
      .from('association_photos')
      .update({ is_primary: true })
      .eq('id', photoId);
    
    if (updateError) throw updateError;
    
    toast.success('Primary photo updated');
    return true;
  } catch (error) {
    console.error('Error setting primary photo:', error);
    toast.error('Failed to update primary photo');
    return false;
  }
};
