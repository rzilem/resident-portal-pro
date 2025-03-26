
/**
 * Utility functions for document categories
 */

import { DocumentCategory } from '@/types/documents';

export const getDocumentCategories = async (): Promise<DocumentCategory[]> => {
  // For now, return mock categories
  // Later this could be fetched from a database
  return [
    { id: 'financial', name: 'Financial Documents', description: 'Budget, financial statements, etc.', accessLevel: 'board' },
    { id: 'legal', name: 'Legal Documents', description: 'Contracts, bylaws, etc.', accessLevel: 'board' },
    { id: 'meetings', name: 'Meeting Minutes', description: 'Board and association meeting minutes', accessLevel: 'homeowner' },
    { id: 'rules', name: 'Rules & Regulations', description: 'HOA rules and guidelines', accessLevel: 'all' },
    { id: 'maintenance', name: 'Maintenance', description: 'Maintenance schedules and records', accessLevel: 'homeowner' },
    { id: 'general', name: 'General', description: 'General association documents', accessLevel: 'all' },
    { id: 'uncategorized', name: 'Uncategorized', description: 'Documents not yet categorized', accessLevel: 'all' },
  ];
};
