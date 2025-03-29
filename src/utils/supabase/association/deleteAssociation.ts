
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
