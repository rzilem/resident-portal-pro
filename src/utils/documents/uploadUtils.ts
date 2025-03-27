
import { supabase } from "@/integrations/supabase/client";
import { DocumentCategory } from "@/types/documents";

/**
 * Fetch document categories from Supabase
 * @returns Array of category names
 */
export const getDocumentCategories = async (): Promise<DocumentCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('document_categories')
      .select('*')
      .order('name');

    if (error) {
      console.error("Error fetching document categories:", error.message);
      return [
        { id: '1', name: 'GENERAL', description: 'General documents', accessLevel: 'all' },
        { id: '2', name: 'FINANCIAL', description: 'Financial documents', accessLevel: 'board' },
        { id: '3', name: 'LEGAL', description: 'Legal documents', accessLevel: 'board' },
        { id: '4', name: 'MAINTENANCE', description: 'Maintenance documents', accessLevel: 'all' }
      ]; // Fallback categories
    }

    return data || [
      { id: '1', name: 'GENERAL', description: 'General documents', accessLevel: 'all' },
      { id: '2', name: 'FINANCIAL', description: 'Financial documents', accessLevel: 'board' },
      { id: '3', name: 'LEGAL', description: 'Legal documents', accessLevel: 'board' },
      { id: '4', name: 'MAINTENANCE', description: 'Maintenance documents', accessLevel: 'all' }
    ];
  } catch (error: unknown) {
    console.error("Unexpected error fetching document categories:", error);
    return [
      { id: '1', name: 'GENERAL', description: 'General documents', accessLevel: 'all' },
      { id: '2', name: 'FINANCIAL', description: 'Financial documents', accessLevel: 'board' },
      { id: '3', name: 'LEGAL', description: 'Legal documents', accessLevel: 'board' },
      { id: '4', name: 'MAINTENANCE', description: 'Maintenance documents', accessLevel: 'all' }
    ]; // Fallback categories
  }
};
