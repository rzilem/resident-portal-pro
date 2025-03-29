
import { supabase } from "@/integrations/supabase/client";
import { Association } from "@/types/association";
import { toast } from "sonner";
import { getAssociationById } from "./getAssociations";
import { handleError } from "./utils";

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
