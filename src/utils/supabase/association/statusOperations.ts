
import { supabase } from "@/integrations/supabase/client";
import { Association } from "@/types/association";
import { toast } from "sonner";
import { fetchAssociations } from "./getAssociations";
import { getAssociationById } from "./getAssociations";
import { updateAssociationSetting } from "./updateAssociation";
import { handleError } from "./utils";

/**
 * Delete an association from Supabase
 * @param {string} id - The association ID to delete
 * @returns {Promise<boolean>} - True if deletion succeeds, false otherwise
 */
export const deleteAssociation = async (id: string): Promise<boolean> => {
  try {
    // Delete association (will cascade delete settings due to foreign key)
    const { error } = await supabase
      .from('associations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Association deleted successfully');
    return true;
  } catch (error) {
    handleError(error, 'delete association');
    return false;
  }
};

/**
 * Set an association as the default
 * @param {string} id - The association ID to set as default
 * @returns {Promise<Association[]>} - Updated array of associations
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
    
    toast.success('Default association updated');
    // Return updated associations
    return await fetchAssociations();
  } catch (error) {
    handleError(error, 'set default association');
    return [];
  }
};

/**
 * Toggle an association's status (active/inactive)
 * @param {string} id - The association ID to toggle
 * @returns {Promise<Association | null>} - The updated association or null if update fails
 */
export const toggleAssociationStatus = async (id: string): Promise<Association | null> => {
  try {
    // Get current association
    const association = await getAssociationById(id);
    if (!association) throw new Error('Association not found');
    
    // Toggle status
    const newStatus = association.status === 'active' ? 'inactive' : 'active';
    const statusText = newStatus === 'active' ? 'activated' : 'deactivated';
    
    // Update status
    const { error } = await supabase
      .from('associations')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success(`Association ${statusText} successfully`);
    // Return updated association
    return await getAssociationById(id);
  } catch (error) {
    handleError(error, 'toggle association status');
    return null;
  }
};
