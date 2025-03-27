
import { supabase } from '@/integrations/supabase/client';

/**
 * Get available document categories
 * @returns Promise<{id: string, name: string}[]> Array of categories
 */
export const getDocumentCategories = async (): Promise<{id: string, name: string}[]> => {
  try {
    // First try to get categories from database
    const { data, error } = await supabase
      .from('document_categories')
      .select('id, name')
      .order('name');
      
    if (error) {
      console.error('Error fetching document categories:', error);
      throw new Error('Failed to fetch document categories');
    }
    
    if (data && data.length > 0) {
      return data;
    }
    
    // If no categories in database, return default categories
    return [
      { id: 'GENERAL', name: 'GENERAL' },
      { id: 'FINANCIAL', name: 'FINANCIAL' },
      { id: 'LEGAL', name: 'LEGAL' },
      { id: 'MAINTENANCE', name: 'MAINTENANCE' },
      { id: 'MEETING', name: 'MEETING' }
    ];
  } catch (error) {
    console.error('Unexpected error fetching document categories:', error);
    
    // Return default categories on error
    return [
      { id: 'GENERAL', name: 'GENERAL' },
      { id: 'FINANCIAL', name: 'FINANCIAL' },
      { id: 'LEGAL', name: 'LEGAL' },
      { id: 'MAINTENANCE', name: 'MAINTENANCE' },
      { id: 'MEETING', name: 'MEETING' }
    ];
  }
};
