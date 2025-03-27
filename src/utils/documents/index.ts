
/**
 * Main export file for document utilities
 */

// Re-export all document utilities
export * from './authUtils';
export * from './bucketUtils';
export * from './documentDbUtils';
export * from './fileUtils';
export * from './policyUtils';
export * from './uploadUtils';

// Add specific functions for document categories
import { DocumentCategory } from '@/types/documents';
import { DOCUMENT_CATEGORIES } from '@/components/database/DocumentCategoryStructure';

/**
 * Get all document categories
 * @returns {Promise<DocumentCategory[]>} Document categories
 */
export const getDocumentCategories = async (): Promise<DocumentCategory[]> => {
  // In a real app, these would come from the database
  // For now, we're using the hardcoded categories from DocumentCategoryStructure
  
  return DOCUMENT_CATEGORIES.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description,
    accessLevel: 'all'
  }));
};

/**
 * Get category by ID
 * @param {string} categoryId - Category ID
 * @returns {Promise<DocumentCategory | undefined>} Category or undefined if not found
 */
export const getDocumentCategoryById = async (categoryId: string): Promise<DocumentCategory | undefined> => {
  const categories = await getDocumentCategories();
  return categories.find(category => category.id === categoryId);
};
