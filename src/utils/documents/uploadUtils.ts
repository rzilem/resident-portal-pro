import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch document categories from Supabase
 * @returns Array of category names
 */
export const getDocumentCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('document_categories')
      .select('name')
      .order('name');

    if (error) {
      console.error("Error fetching document categories:", error.message);
      return ['GENERAL', 'FINANCIAL', 'LEGAL', 'MAINTENANCE']; // Fallback categories
    }

    return data?.map(item => item.name) || ['GENERAL', 'FINANCIAL', 'LEGAL', 'MAINTENANCE'];
  } catch (error: unknown) {
    console.error("Unexpected error fetching document categories:", error);
    return ['GENERAL', 'FINANCIAL', 'LEGAL', 'MAINTENANCE']; // Fallback categories
  }
};
