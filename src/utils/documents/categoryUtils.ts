
/**
 * Utility functions for document categories
 */

import { DocumentCategory } from '@/types/documents';
import { debugLog, errorLog } from '@/utils/debug';

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
