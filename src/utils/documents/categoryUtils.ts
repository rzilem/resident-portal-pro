
import { DocumentCategory } from '@/types/documents';

/**
 * Get all document categories with their access levels and descriptions
 * @returns Promise<DocumentCategory[]> The list of document categories
 */
export const getDocumentCategories = async (): Promise<DocumentCategory[]> => {
  try {
    // In a real app, this would fetch from an API or database
    // For now, returning mock data
    const categories: DocumentCategory[] = [
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
    
    return categories;
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
  accessLevel: string
): Promise<DocumentCategory> => {
  try {
    // In a real app, this would update the database
    // For now, just returning a mock response
    return {
      id: categoryId,
      name: 'Updated Category',
      accessLevel: accessLevel as any
    };
  } catch (error) {
    console.error('Error updating category access level:', error);
    throw new Error('Failed to update category access level');
  }
};
