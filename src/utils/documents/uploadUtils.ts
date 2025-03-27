
import { supabase } from "@/integrations/supabase/client";

/**
 * Interface for document categories
 */
interface DocumentCategory {
  name: string;
}

/**
 * Fetch document categories from Supabase
 * @returns Array of category names
 */
export const getDocumentCategories = async (): Promise<DocumentCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('document_categories')
      .select('name')
      .order('name');

    if (error) {
      console.error("Error fetching document categories:", error.message);
      return [
        { name: 'GENERAL' },
        { name: 'FINANCIAL' },
        { name: 'LEGAL' },
        { name: 'MAINTENANCE' }
      ]; // Fallback categories
    }

    return data?.map(item => ({ name: item.name })) || [
      { name: 'GENERAL' },
      { name: 'FINANCIAL' },
      { name: 'LEGAL' },
      { name: 'MAINTENANCE' }
    ];
  } catch (error: unknown) {
    console.error("Unexpected error fetching document categories:", error);
    return [
      { name: 'GENERAL' },
      { name: 'FINANCIAL' },
      { name: 'LEGAL' },
      { name: 'MAINTENANCE' }
    ]; // Fallback categories
  }
};
