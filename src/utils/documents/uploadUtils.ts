
import { supabase } from '@/integrations/supabase/client';
import { DocumentAccessLevel } from '@/types/documents';

/**
 * Get available document categories
 * @returns Promise<{id: string, name: string, accessLevel?: DocumentAccessLevel}[]> Array of categories
 */
export const getDocumentCategories = async (): Promise<{id: string, name: string, accessLevel?: DocumentAccessLevel}[]> => {
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
      return data.map(category => ({
        id: category.id,
        name: category.name,
        // Since access_level doesn't exist in the table, default to 'all'
        accessLevel: 'all' as DocumentAccessLevel
      }));
    }
    
    // If no categories in database, return default categories
    return [
      { id: 'GENERAL', name: 'GENERAL', accessLevel: 'all' },
      { id: 'FINANCIAL', name: 'FINANCIAL', accessLevel: 'board' },
      { id: 'LEGAL', name: 'LEGAL', accessLevel: 'management' },
      { id: 'MAINTENANCE', name: 'MAINTENANCE', accessLevel: 'all' },
      { id: 'MEETING', name: 'MEETING', accessLevel: 'homeowner' }
    ];
  } catch (error) {
    console.error('Unexpected error fetching document categories:', error);
    
    // Return default categories on error
    return [
      { id: 'GENERAL', name: 'GENERAL', accessLevel: 'all' },
      { id: 'FINANCIAL', name: 'FINANCIAL', accessLevel: 'board' },
      { id: 'LEGAL', name: 'LEGAL', accessLevel: 'management' },
      { id: 'MAINTENANCE', name: 'MAINTENANCE', accessLevel: 'all' },
      { id: 'MEETING', name: 'MEETING', accessLevel: 'homeowner' }
    ];
  }
};
