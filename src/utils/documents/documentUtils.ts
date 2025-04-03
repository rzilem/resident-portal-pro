
import { supabase } from '@/integrations/supabase/client';
import { DocumentCategory } from '@/types/documents';

/**
 * Fetch available document categories from the system
 * @returns Promise resolving to an array of document categories
 */
export const getDocumentCategories = async (): Promise<DocumentCategory[]> => {
  try {
    // First try to get categories from database
    const { data, error } = await supabase
      .from('document_categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching document categories:', error);
      // Fall back to default categories
      return [
        { id: 'financial', name: 'Financial Documents' },
        { id: 'legal', name: 'Legal Documents' },
        { id: 'meeting', name: 'Meeting Minutes' },
        { id: 'maintenance', name: 'Maintenance Records' },
        { id: 'reports', name: 'Reports' },
        { id: 'general', name: 'General' }
      ];
    }
    
    if (data && data.length > 0) {
      return data.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        accessLevel: category.access_level,
        color: category.color,
        parent: category.parent,
        isRestricted: category.is_restricted,
        requiredPermission: category.required_permission,
        sortOrder: category.sort_order
      }));
    }
    
    // If no categories in database, return defaults
    return [
      { id: 'financial', name: 'Financial Documents' },
      { id: 'legal', name: 'Legal Documents' },
      { id: 'meeting', name: 'Meeting Minutes' },
      { id: 'maintenance', name: 'Maintenance Records' },
      { id: 'reports', name: 'Reports' },
      { id: 'general', name: 'General' }
    ];
  } catch (error) {
    console.error('Error in getDocumentCategories:', error);
    // Fall back to default categories
    return [
      { id: 'financial', name: 'Financial Documents' },
      { id: 'legal', name: 'Legal Documents' },
      { id: 'meeting', name: 'Meeting Minutes' },
      { id: 'maintenance', name: 'Maintenance Records' },
      { id: 'reports', name: 'Reports' },
      { id: 'general', name: 'General' }
    ];
  }
};

/**
 * Synchronize categories with the database
 * @param categories Categories to synchronize
 * @returns Promise resolving to a boolean indicating success
 */
export const syncCategoriesToSupabase = async (categories: DocumentCategory[]): Promise<boolean> => {
  try {
    // For each category, upsert it to the database
    for (const category of categories) {
      const { error } = await supabase
        .from('document_categories')
        .upsert({
          id: category.id,
          name: category.name,
          description: category.description || null,
          access_level: category.accessLevel || 'all',
          color: category.color || null,
          parent: category.parent || null,
          is_restricted: category.isRestricted || false,
          required_permission: category.requiredPermission || null,
          sort_order: category.sortOrder || 0
        });
      
      if (error) {
        console.error('Error upserting category:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in syncCategoriesToSupabase:', error);
    return false;
  }
};
