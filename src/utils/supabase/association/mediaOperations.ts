
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { updateAssociationSetting } from "./updateAssociation";
import { handleError, validateFile } from "./utils";

/**
 * Upload a logo for an association
 * @param {string} associationId - The association ID
 * @param {File} file - The logo file to upload
 * @returns {Promise<string | null>} - The public URL of the uploaded logo or null if upload fails
 */
export const uploadAssociationLogo = async (
  associationId: string, 
  file: File
): Promise<string | null> => {
  try {
    // Validate file
    validateFile(file, {
      maxSizeMB: 2,
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    });
    
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${associationId}-logo-${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;
    
    // Upload file to storage
    const { error: uploadError } = await supabase
      .storage
      .from('association_files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data } = await supabase
      .storage
      .from('association_files')
      .getPublicUrl(filePath);
    
    const publicUrl = data.publicUrl;
    
    // Update logo URL in settings
    await updateAssociationSetting(associationId, 'logoUrl', publicUrl);
    
    toast.success('Logo uploaded successfully');
    return publicUrl;
  } catch (error) {
    handleError(error, 'upload association logo');
    return null;
  }
};

/**
 * Delete an association logo
 * @param {string} associationId - The association ID
 * @param {string} logoUrl - The current logo URL to delete
 * @returns {Promise<boolean>} - True if deletion succeeds, false otherwise
 */
export const deleteAssociationLogo = async (
  associationId: string,
  logoUrl: string
): Promise<boolean> => {
  try {
    // Extract path from URL
    const urlParts = logoUrl.split('association_files/');
    if (urlParts.length < 2) {
      throw new Error('Invalid logo URL format');
    }
    
    const filePath = urlParts[1];
    
    // Delete from storage
    const { error: deleteError } = await supabase
      .storage
      .from('association_files')
      .remove([filePath]);
    
    if (deleteError) throw deleteError;
    
    // Remove logo URL from settings
    await updateAssociationSetting(associationId, 'logoUrl', null);
    
    toast.success('Logo deleted successfully');
    return true;
  } catch (error) {
    handleError(error, 'delete association logo');
    return false;
  }
};
