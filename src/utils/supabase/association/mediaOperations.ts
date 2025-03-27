
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { updateAssociationSetting } from "./updateAssociation";

/**
 * Upload a logo for an association
 */
export const uploadAssociationLogo = async (
  associationId: string, 
  file: File
): Promise<string | null> => {
  try {
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
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading association logo:', error);
    toast.error('Failed to upload logo');
    return null;
  }
};
