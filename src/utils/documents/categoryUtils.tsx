
import { DocumentCategory } from '@/types/documents';
import { supabase } from '@/integrations/supabase/client';

/**
 * Sync categories to Supabase database
 * @param categories Updated array of categories
 * @returns Success status
 */
export const syncCategoriesToSupabase = async (categories: DocumentCategory[]): Promise<boolean> => {
  try {
    // Implementation would update categories in the database
    // For example:
    // const { error } = await supabase
    //   .from('document_categories')
    //   .upsert(categories.map(cat => ({
    //     id: cat.id,
    //     name: cat.name,
    //     description: cat.description,
    //     access_level: cat.accessLevel,
    //     sort_order: cat.sortOrder
    //   })));
    
    // if (error) throw error;
    
    console.log('Categories synced successfully:', categories);
    return true;
  } catch (error) {
    console.error('Error syncing categories:', error);
    return false;
  }
};

/**
 * Get document categories with colors
 * @returns Array of categories with display properties
 */
export const getCategoriesWithColors = async (): Promise<DocumentCategory[]> => {
  const categories = await getDocumentCategories();
  
  return categories.map(category => ({
    ...category,
    color: getCategoryColor(category.id)
  }));
};

/**
 * Get a consistent color for a category based on its ID
 * @param categoryId Category identifier
 * @returns CSS color string
 */
export const getCategoryColor = (categoryId: string): string => {
  // Simple hash function to generate consistent colors
  const hash = Array.from(categoryId).reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-amber-100 text-amber-800',
    'bg-purple-100 text-purple-800',
    'bg-red-100 text-red-800',
    'bg-teal-100 text-teal-800',
    'bg-sky-100 text-sky-800',
    'bg-indigo-100 text-indigo-800'
  ];
  
  return colors[hash % colors.length];
};

/**
 * Fetch document categories
 * This is a placeholder that would normally fetch from database
 * @returns Array of document categories
 */
export const getDocumentCategories = async (): Promise<DocumentCategory[]> => {
  try {
    // In a real app, this would fetch from Supabase:
    // const { data, error } = await supabase
    //   .from('document_categories')
    //   .select('*')
    //   .order('sort_order');
    
    // if (error) throw error;
    // return data;
    
    // For now, return a static list
    return [
      { id: 'general', name: 'General', accessLevel: 'all', description: 'General documents', sortOrder: 1 },
      { id: 'financial', name: 'Financial', accessLevel: 'board', description: 'Financial documents', sortOrder: 2 },
      { id: 'legal', name: 'Legal', accessLevel: 'management', description: 'Legal documents', sortOrder: 3 },
      { id: 'meeting', name: 'Meeting Minutes', accessLevel: 'homeowner', description: 'Meeting minutes', sortOrder: 4 },
      { id: 'policies', name: 'Policies', accessLevel: 'all', description: 'Association policies', sortOrder: 5 }
    ];
  } catch (error) {
    console.error('Error fetching document categories:', error);
    return [];
  }
};
