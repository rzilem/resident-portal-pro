
import { supabase } from "@/integrations/supabase/client";
import { Association } from "@/types/association";
import { toast } from "sonner";
import { AssociationQueryResult, transformToAssociation } from "./types";
import { fetchAssociationsWithSettings, getAssociationWithSettings, handleError } from "./utils";

/**
 * Fetch all associations from Supabase
 * @returns {Promise<Association[]>} - Array of associations
 */
export const fetchAssociations = async (): Promise<Association[]> => {
  try {
    const data = await fetchAssociationsWithSettings();
    return data.map(item => transformToAssociation(item));
  } catch (error) {
    handleError(error, 'fetch associations');
    return [];
  }
};

/**
 * Get an association by ID
 * @param {string} id - The association ID
 * @returns {Promise<Association | null>} - The association object or null if not found
 */
export const getAssociationById = async (id: string): Promise<Association | null> => {
  try {
    const data = await getAssociationWithSettings(id);
    return transformToAssociation(data);
  } catch (error) {
    handleError(error, 'fetch association');
    return null;
  }
};

/**
 * Search associations by name or other criteria
 * @param {string} query - The search query
 * @returns {Promise<Association[]>} - Array of matching associations
 */
export const searchAssociations = async (query: string): Promise<Association[]> => {
  try {
    if (!query || query.trim() === '') {
      return await fetchAssociations();
    }
    
    const { data, error } = await supabase
      .from('associations')
      .select(`
        *,
        association_settings(settings)
      `)
      .ilike('name', `%${query}%`)
      .order('name');
    
    if (error) throw error;
    
    return (data as AssociationQueryResult[]).map(item => transformToAssociation(item));
  } catch (error) {
    handleError(error, 'search associations');
    return [];
  }
};
