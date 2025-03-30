
import { supabase } from '@/integrations/supabase/client';
import { DocumentCategory, DocumentAccessLevel } from '@/types/documents';

/**
 * Get all document categories
 * @returns Promise<DocumentCategory[]> The categories
 */
export const getDocumentCategories = async (): Promise<DocumentCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('document_categories')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error getting document categories:', error);
      return [];
    }
    
    // Map database response to DocumentCategory objects
    return data.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description || '',
      accessLevel: (category.access_level || 'all') as DocumentAccessLevel
    }));
  } catch (error) {
    console.error('Unexpected error getting document categories:', error);
    return [];
  }
};

/**
 * Create a new document category
 * @param category The category to create
 * @returns Promise<DocumentCategory> The created category
 */
export const createDocumentCategory = async (
  category: Omit<DocumentCategory, 'id'>
): Promise<DocumentCategory | null> => {
  try {
    const { data, error } = await supabase
      .from('document_categories')
      .insert({
        name: category.name,
        description: category.description,
        access_level: category.accessLevel || 'all'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating document category:', error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      accessLevel: (data.access_level || 'all') as DocumentAccessLevel
    };
  } catch (error) {
    console.error('Unexpected error creating document category:', error);
    return null;
  }
};

/**
 * Update a document category
 * @param id The ID of the category to update
 * @param updates The updates to apply
 * @returns Promise<DocumentCategory> The updated category
 */
export const updateDocumentCategory = async (
  id: string,
  updates: Partial<DocumentCategory>
): Promise<DocumentCategory | null> => {
  try {
    const { data, error } = await supabase
      .from('document_categories')
      .update({
        name: updates.name,
        description: updates.description,
        access_level: updates.accessLevel || 'all'
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating document category:', error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      accessLevel: (data.access_level || 'all') as DocumentAccessLevel
    };
  } catch (error) {
    console.error('Unexpected error updating document category:', error);
    return null;
  }
};

/**
 * Update a document category's access level
 * @param id The ID of the category
 * @param accessLevel The new access level
 * @returns Promise<boolean> Whether the update was successful
 */
export const updateCategoryAccessLevel = async (
  id: string,
  accessLevel: DocumentAccessLevel
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('document_categories')
      .update({
        access_level: accessLevel
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating document category access level:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error updating document category access level:', error);
    return false;
  }
};

/**
 * Delete a document category
 * @param id The ID of the category to delete
 * @returns Promise<boolean> Whether the deletion was successful
 */
export const deleteDocumentCategory = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('document_categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting document category:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error deleting document category:', error);
    return false;
  }
};

/**
 * Synchronize categories to Supabase
 * @param categories Array of DocumentCategory objects to synchronize
 * @returns Promise<boolean> Whether the synchronization was successful
 */
export const syncCategoriesToSupabase = async (
  categories: DocumentCategory[]
): Promise<boolean> => {
  try {
    // For each category, update it in the database
    for (const category of categories) {
      const { error } = await supabase
        .from('document_categories')
        .update({
          name: category.name,
          description: category.description || '',
          access_level: category.accessLevel || 'all'
        })
        .eq('id', category.id);
      
      if (error) {
        console.error(`Error syncing category ${category.id}:`, error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error syncing categories:', error);
    return false;
  }
};
