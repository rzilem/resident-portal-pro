import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { uploadFile, deleteFile } from '@/utils/storage/fileUploader';
import { StorageBucket } from '@/utils/storage/bucketManager';

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
  content_type: 'image' | 'embed';
  embed_html?: string;
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
    console.log(`Starting upload for association: ${associationId}, file: ${file.name}`);
    
    // Use our new uploadFile utility
    const result = await uploadFile(file, StorageBucket.ASSOCIATION_PHOTOS, {
      path: associationId,
      maxSizeMB: 10,
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      metadata: {
        association_id: associationId,
        description: description || ''
      }
    });
    
    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }
    
    // Store the reference in the database
    const { data: photo, error } = await supabase
      .from('association_photos')
      .insert({
        association_id: associationId,
        url: result.url,
        file_name: result.name,
        file_size: result.size,
        file_type: result.type,
        description: description || null,
        content_type: 'image'
      })
      .select('*')
      .single();
    
    if (error) {
      console.error('Database error when saving photo metadata:', error);
      throw error;
    }
    
    console.log('Photo metadata saved successfully:', photo);
    toast.success('Photo uploaded successfully');
    return photo;
  } catch (error) {
    console.error('Error uploading association photo:', error);
    toast.error('Failed to upload photo');
    return null;
  }
};

/**
 * Add an HTML embed (like a 3D rendering) to an association
 * @param associationId Association ID
 * @param embedHtml HTML code for the embed
 * @param description Optional description
 * @returns The added embed object or null if failed
 */
export const addAssociationEmbed = async (
  associationId: string,
  embedHtml: string,
  description?: string
): Promise<AssociationPhoto | null> => {
  try {
    console.log(`Adding embed for association: ${associationId}`);
    
    // Generate a placeholder name for the embed
    const fileName = `embed-${Date.now()}`;
    
    // Insert the embed record in the database
    const { data: embed, error } = await supabase
      .from('association_photos')
      .insert({
        association_id: associationId,
        url: '', // No URL for embeds
        file_name: fileName,
        file_size: embedHtml.length, // Use the length of the HTML as file size
        file_type: 'text/html',
        description: description || null,
        content_type: 'embed',
        embed_html: embedHtml
      })
      .select('*')
      .single();
    
    if (error) {
      console.error('Database error when saving embed:', error);
      throw error;
    }
    
    console.log('Embed saved successfully:', embed);
    toast.success('3D view added successfully');
    return embed;
  } catch (error) {
    console.error('Error adding association embed:', error);
    toast.error('Failed to add 3D view');
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
    
    // For image type content, also delete the file from storage
    if (photo.content_type === 'image' && photo.url) {
      // Extract path from URL
      const pathMatch = photo.url.match(/association_photos\/(.+)$/);
      if (pathMatch && pathMatch[1]) {
        // Use our new deleteFile utility
        await deleteFile(pathMatch[1], StorageBucket.ASSOCIATION_PHOTOS);
      }
    }
    
    toast.success(photo.content_type === 'embed' ? '3D view deleted successfully' : 'Photo deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting association photo:', error);
    toast.error('Failed to delete item');
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
