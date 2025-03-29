
import { supabase } from "@/integrations/supabase/client";
import { Association } from "@/types/association";
import { toast } from "sonner";
import { fetchAssociations } from "./getAssociations";
import { updateAssociationSetting } from "./updateAssociation";
import { handleError } from "./utils";

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
