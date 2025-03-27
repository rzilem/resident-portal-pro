
/**
 * Utility functions for document management
 */

import { supabase } from '@/integrations/supabase/client';
import { debugLog, errorLog } from '@/utils/debug';
import { DocumentCategory } from '@/types/documents';

/**
 * Format file size in bytes to a human-readable format
 * @param bytes File size in bytes
 * @returns Formatted file size (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

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
