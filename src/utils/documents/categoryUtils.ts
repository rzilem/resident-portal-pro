
/**
 * Utility functions for document categories
 */

import { supabase } from '@/integrations/supabase/client';
import { debugLog, errorLog } from '@/utils/debug';
import { DocumentCategory } from '@/types/documents';

/**
 * Get all document categories
 * @returns Promise<DocumentCategory[]> List of document categories
 */
export const getDocumentCategories = async (): Promise<DocumentCategory[]> => {
  try {
    const defaultCategories: DocumentCategory[] = [
      { id: 'general', name: 'General', description: 'General documents', sortOrder: 1 },
      { id: 'financial', name: 'Financial', description: 'Financial documents', sortOrder: 2 },
      { id: 'legal', name: 'Legal', description: 'Legal documents', sortOrder: 3 },
      { id: 'meetings', name: 'Meetings', description: 'Meeting minutes and agendas', sortOrder: 4 },
      { id: 'maintenance', name: 'Maintenance', description: 'Maintenance records and reports', sortOrder: 5 },
      { id: 'compliance', name: 'Compliance', description: 'Compliance documents', sortOrder: 6 },
      { id: 'communications', name: 'Communications', description: 'Community communications', sortOrder: 7 }
    ];
    
    return defaultCategories;
  } catch (error) {
    errorLog("Error getting document categories:", error);
    return [];
  }
};

/**
 * Get category by ID
 * @param categoryId Category ID
 * @returns Promise<DocumentCategory|null> Category or null if not found
 */
export const getCategoryById = async (categoryId: string): Promise<DocumentCategory | null> => {
  try {
    const categories = await getDocumentCategories();
    return categories.find(cat => cat.id === categoryId) || null;
  } catch (error) {
    errorLog("Error getting category by ID:", error);
    return null;
  }
};
