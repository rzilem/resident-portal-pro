
/**
 * Utility functions for document categories
 */

import { DocumentCategory, DocumentAccessLevel } from '@/types/documents';
import { debugLog, errorLog } from '@/utils/debug';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Create a new document category
 * @param category Category data
 * @returns Promise<{ success: boolean, id?: string, error?: string }>
 */
export const createDocumentCategory = async (category: Partial<DocumentCategory>): Promise<{ success: boolean, id?: string, error?: string }> => {
  try {
    // This is a placeholder - in a real app, this would save to a database
    const id = `cat_${Date.now()}`;
    
    debugLog("Created category:", { ...category, id });
    
    return {
      success: true,
      id
    };
  } catch (error) {
    errorLog("Error creating category:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error creating category"
    };
  }
};

/**
 * Update a document category
 * @param categoryId Category ID
 * @param updates Category updates
 * @returns Promise<boolean> Success status
 */
export const updateDocumentCategory = async (categoryId: string, updates: Partial<DocumentCategory>): Promise<boolean> => {
  try {
    // This is a placeholder - in a real app, this would update a database
    debugLog("Updated category:", { id: categoryId, ...updates });
    
    return true;
  } catch (error) {
    errorLog("Error updating category:", error);
    return false;
  }
};

/**
 * Delete a document category
 * @param categoryId Category ID
 * @returns Promise<boolean> Success status
 */
export const deleteDocumentCategory = async (categoryId: string): Promise<boolean> => {
  try {
    // This is a placeholder - in a real app, this would delete from a database
    debugLog("Deleted category:", categoryId);
    
    return true;
  } catch (error) {
    errorLog("Error deleting category:", error);
    return false;
  }
};

/**
 * Synchronize document categories with Supabase
 * @param categories Array of document categories to synchronize
 * @returns Promise<boolean> Success status
 */
export const syncCategoriesToSupabase = async (categories: DocumentCategory[]): Promise<boolean> => {
  try {
    // First get existing categories from Supabase
    const { data: existingCategories, error: fetchError } = await supabase
      .from('document_categories')
      .select('id, name, description, sort_order');
      
    if (fetchError) {
      console.error('Error fetching existing categories:', fetchError);
      toast.error('Failed to fetch existing categories from database');
      return false;
    }
    
    // Create a mapping of existing categories by name for quick lookup
    const existingCategoryMap = new Map();
    existingCategories?.forEach(cat => {
      existingCategoryMap.set(cat.name.toLowerCase(), cat);
    });
    
    // Process each category - update existing ones or insert new ones
    const promises = categories.map(async (category, index) => {
      // Check if this category already exists in Supabase
      const existingCategory = existingCategoryMap.get(category.name.toLowerCase());
      
      if (existingCategory) {
        // Category exists, update it
        const { error } = await supabase
          .from('document_categories')
          .update({
            name: category.name,
            description: category.description || null,
            sort_order: index
          })
          .eq('id', existingCategory.id);
        
        if (error) {
          console.error(`Error updating category ${category.name}:`, error);
          return false;
        }
        return true;
      } else {
        // Category doesn't exist, insert it
        const { error } = await supabase
          .from('document_categories')
          .insert({
            name: category.name,
            description: category.description || null,
            sort_order: index
          });
        
        if (error) {
          console.error(`Error creating category ${category.name}:`, error);
          return false;
        }
        return true;
      }
    });
    
    // Wait for all operations to complete
    const results = await Promise.all(promises);
    
    // Check if any operation failed
    const allSuccessful = results.every(result => result === true);
    
    if (allSuccessful) {
      toast.success('Document categories synchronized successfully');
    } else {
      toast.error('Some categories failed to synchronize');
    }
    
    return allSuccessful;
  } catch (error) {
    console.error('Unexpected error synchronizing categories:', error);
    toast.error('Failed to synchronize document categories');
    return false;
  }
};
