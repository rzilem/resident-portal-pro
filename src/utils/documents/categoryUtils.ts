
import { DocumentCategory, DocumentAccessLevel } from '@/types/documents';
import { supabase } from '@/integrations/supabase/client';

/**
 * Get all document categories with their access levels and descriptions
 * @returns Promise<DocumentCategory[]> The list of document categories
 */
export const getDocumentCategories = async (): Promise<DocumentCategory[]> => {
  try {
    // First try to get categories from database
    const { data, error } = await supabase
      .from('document_categories')
      .select('id, name, description, sort_order')
      .order('sort_order', { ascending: true });
      
    if (error) {
      console.error('Error fetching document categories:', error);
      throw new Error('Failed to fetch document categories');
    }
    
    if (data && data.length > 0) {
      return data.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description || undefined,
        sortOrder: category.sort_order || undefined,
        // Add default access level
        accessLevel: 'all' as DocumentAccessLevel
      }));
    }
    
    // If no categories in database, return default categories
    return [
      {
        id: 'governing',
        name: 'Governing Documents',
        description: 'Association bylaws, CC&Rs, articles of incorporation',
        accessLevel: 'homeowner'
      },
      {
        id: 'financial',
        name: 'Financial Documents',
        description: 'Budgets, financial statements, reserve studies',
        accessLevel: 'board'
      },
      {
        id: 'meetings',
        name: 'Meeting Minutes',
        description: 'Board meeting minutes and annual meeting notes',
        accessLevel: 'homeowner'
      },
      {
        id: 'legal',
        name: 'Legal Documents',
        description: 'Contracts, legal opinions, litigation documents',
        accessLevel: 'management'
      },
      {
        id: 'communication',
        name: 'Communications',
        description: 'Newsletters, announcements, community bulletins',
        accessLevel: 'all'
      },
      {
        id: 'resources',
        name: 'Resources',
        description: 'Helpful resources and guides for homeowners',
        accessLevel: 'all'
      },
      {
        id: 'inspections',
        name: 'Inspections',
        description: 'Property inspections and reports',
        accessLevel: 'board'
      },
      {
        id: 'insurance',
        name: 'Insurance',
        description: 'Insurance policies and claims',
        accessLevel: 'management'
      }
    ];
  } catch (error) {
    console.error('Error getting document categories:', error);
    throw new Error('Failed to fetch document categories');
  }
};

/**
 * Update a document category's access level
 * @param categoryId The ID of the category to update
 * @param accessLevel The new access level
 * @returns Promise<DocumentCategory> The updated category
 */
export const updateCategoryAccessLevel = async (
  categoryId: string, 
  accessLevel: DocumentAccessLevel
): Promise<DocumentCategory> => {
  try {
    // First, determine if this is a default category or database category
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryId);
    
    if (isUUID) {
      // Database category - update in database
      const { data, error } = await supabase
        .from('document_categories')
        .update({ access_level: accessLevel })
        .eq('id', categoryId)
        .select('id, name, description, sort_order')
        .single();
        
      if (error) {
        console.error('Error updating category access level:', error);
        throw new Error('Failed to update category access level');
      }
      
      return {
        id: data.id,
        name: data.name,
        description: data.description || undefined,
        sortOrder: data.sort_order || undefined,
        accessLevel
      };
    } else {
      // Default category - would need to save to user preferences or a special table
      // For now, just return the updated category object
      return {
        id: categoryId,
        name: 'Updated Category',
        accessLevel
      };
    }
  } catch (error) {
    console.error('Error updating category access level:', error);
    throw new Error('Failed to update category access level');
  }
};

/**
 * Synchronize document categories to Supabase
 * @param categories The categories to synchronize
 * @returns Promise<boolean> Success indicator
 */
export const syncCategoriesToSupabase = async (categories: DocumentCategory[]): Promise<boolean> => {
  try {
    console.log('Syncing categories to Supabase:', categories);
    
    for (const category of categories) {
      // Try to update existing category first
      const { error: updateError } = await supabase
        .from('document_categories')
        .update({
          name: category.name,
          description: category.description,
          access_level: category.accessLevel,
          sort_order: category.sortOrder || 0
        })
        .eq('id', category.id);
      
      // If update fails, insert new category
      if (updateError) {
        const { error: insertError } = await supabase
          .from('document_categories')
          .insert({
            id: category.id,
            name: category.name,
            description: category.description,
            access_level: category.accessLevel,
            sort_order: category.sortOrder || 0
          });
          
        if (insertError) {
          console.error('Error inserting category:', insertError);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error syncing categories to Supabase:', error);
    return false;
  }
};
