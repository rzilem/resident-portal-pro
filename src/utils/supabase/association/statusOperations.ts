
import { supabase } from "@/integrations/supabase/client";
import { Association } from "@/types/association";
import { toast } from "sonner";
import { fetchAssociations } from "./getAssociations";
import { getAssociationById } from "./getAssociations";
import { updateAssociationSetting } from "./updateAssociation";

/**
 * Delete an association from Supabase
 */
export const deleteAssociation = async (id: string): Promise<boolean> => {
  try {
    // Delete association (will cascade delete settings due to foreign key)
    const { error } = await supabase
      .from('associations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting association:', error);
    toast.error('Failed to delete association');
    return false;
  }
};

/**
 * Set an association as the default
 */
export const setDefaultAssociation = async (id: string): Promise<Association[]> => {
  try {
    // First get all associations to update their settings
    const associations = await fetchAssociations();
    
    // Update each association's settings
    for (const association of associations) {
      if (!association.settings) continue;
      
      const isDefault = association.id === id;
      await updateAssociationSetting(association.id, 'isDefault', isDefault);
    }
    
    // Return updated associations
    return await fetchAssociations();
  } catch (error) {
    console.error('Error setting default association:', error);
    toast.error('Failed to set default association');
    return [];
  }
};

/**
 * Toggle an association's status
 */
export const toggleAssociationStatus = async (id: string): Promise<Association | null> => {
  try {
    // Get current association
    const association = await getAssociationById(id);
    if (!association) throw new Error('Association not found');
    
    // Toggle status
    const newStatus = association.status === 'active' ? 'inactive' : 'active';
    
    // Update status
    const { error } = await supabase
      .from('associations')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (error) throw error;
    
    // Return updated association
    return await getAssociationById(id);
  } catch (error) {
    console.error('Error toggling association status:', error);
    toast.error('Failed to toggle association status');
    return null;
  }
};
