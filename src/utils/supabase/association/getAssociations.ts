
import { supabase } from "@/integrations/supabase/client";
import { Association } from "@/types/association";
import { toast } from "sonner";
import { AssociationQueryResult, transformToAssociation } from "./types";

/**
 * Fetch all associations from Supabase
 */
export const fetchAssociations = async (): Promise<Association[]> => {
  try {
    const { data, error } = await supabase
      .from('associations')
      .select(`
        *,
        association_settings(settings)
      `)
      .order('name');
    
    if (error) throw error;
    
    // Transform the returned data to match our Association type
    return (data as AssociationQueryResult[]).map(item => transformToAssociation(item));
  } catch (error) {
    console.error('Error fetching associations:', error);
    toast.error('Failed to fetch associations');
    return [];
  }
};

/**
 * Get an association by ID
 */
export const getAssociationById = async (id: string): Promise<Association | null> => {
  try {
    const { data, error } = await supabase
      .from('associations')
      .select(`
        *,
        association_settings(settings)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Transform to our Association type
    return transformToAssociation(data as AssociationQueryResult);
  } catch (error) {
    console.error('Error fetching association by ID:', error);
    return null;
  }
};
