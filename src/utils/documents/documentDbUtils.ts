
import { supabase } from '@/integrations/supabase/client';
import { DocumentFile, DocumentCategory } from '@/types/documents';

export interface GetDocumentsOptions {
  query?: string;
  categories?: string[];
  tags?: string[];
  associationId?: string;
  isPublic?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Get documents from the database with optional filtering
 * @param filters Filtering options
 * @param associationId Association ID to filter by
 * @param role User role for access control
 * @returns Promise resolving to array of DocumentFile objects
 */
export const getDocuments = async (
  filters: GetDocumentsOptions,
  associationId: string,
  role?: string
): Promise<DocumentFile[]> => {
  try {
    let query = supabase
      .from('documents')
      .select('*')
      .eq('association_id', associationId);
    
    // Apply filters
    if (filters.query) {
      query = query.ilike('name', `%${filters.query}%`);
    }
    
    if (filters.categories && filters.categories.length > 0 && !filters.categories.includes('all')) {
      query = query.in('category', filters.categories);
    }
    
    if (filters.tags && filters.tags.length > 0) {
      // For array containment in Supabase
      filters.tags.forEach(tag => {
        query = query.contains('tags', [tag]);
      });
    }
    
    if (filters.isPublic !== undefined) {
      query = query.eq('is_public', filters.isPublic);
    }
    
    // Always filter out archived documents unless specifically requested
    query = query.eq('is_archived', false);
    
    // Apply access control based on role if provided
    if (role && role !== 'admin') {
      const roleAccess = {
        manager: ['management', 'board', 'homeowner', 'all'],
        staff: ['management', 'board', 'homeowner', 'all'],
        board_member: ['board', 'homeowner', 'all'],
        resident: ['homeowner', 'all'],
      };
      
      const accessLevels = (roleAccess as any)[role] || ['all'];
      if (accessLevels.length > 0) {
        query = query.in('access_level', accessLevels);
      }
    }
    
    // Apply sorting
    if (filters.sortBy) {
      query = query.order(filters.sortBy, {
        ascending: filters.sortDirection === 'asc'
      });
    } else {
      // Default sort by uploaded date, newest first
      query = query.order('uploaded_date', { ascending: false });
    }
    
    // Apply pagination if provided
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching documents:', error);
      throw new Error(`Failed to fetch documents: ${error.message}`);
    }
    
    // Transform the data to match our DocumentFile interface
    return data.map(doc => ({
      id: doc.id,
      name: doc.name,
      description: doc.description || '',
      fileSize: doc.file_size,
      size: doc.file_size, // For compatibility
      fileType: doc.file_type,
      url: doc.url,
      category: doc.category,
      tags: doc.tags || [],
      uploadedBy: doc.uploaded_by,
      uploadedDate: doc.uploaded_date,
      lastModified: doc.last_modified,
      // Ensure version is always a number for comparison operations
      version: typeof doc.version === 'string' ? parseInt(doc.version, 10) : doc.version || 1,
      isPublic: doc.is_public,
      isArchived: doc.is_archived
    }));
  } catch (error) {
    console.error('Error in getDocuments:', error);
    throw new Error('Failed to fetch documents');
  }
};

/**
 * Get document categories from the database or return default ones
 * @returns Promise resolving to array of DocumentCategory objects
 */
export const getCategories = async (): Promise<DocumentCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('document_categories')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching document categories:', error);
      // Return default categories if database query fails
      return [
        { id: 'financial', name: 'Financial Documents' },
        { id: 'legal', name: 'Legal Documents' },
        { id: 'meeting', name: 'Meeting Minutes' },
        { id: 'maintenance', name: 'Maintenance' },
        { id: 'reports', name: 'Reports' },
        { id: 'general', name: 'General' }
      ];
    }
    
    if (!data || data.length === 0) {
      // Return default categories if none in database
      return [
        { id: 'financial', name: 'Financial Documents' },
        { id: 'legal', name: 'Legal Documents' },
        { id: 'meeting', name: 'Meeting Minutes' },
        { id: 'maintenance', name: 'Maintenance' },
        { id: 'reports', name: 'Reports' },
        { id: 'general', name: 'General' }
      ];
    }
    
    // Transform database results to DocumentCategory objects
    return data.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      accessLevel: category.access_level,
      sortOrder: category.sort_order,
      // Add value/label for dropdown compatibility
      value: category.id,
      label: category.name
    }));
  } catch (error) {
    console.error('Error in getCategories:', error);
    // Return default categories on error
    return [
      { id: 'financial', name: 'Financial Documents' },
      { id: 'legal', name: 'Legal Documents' },
      { id: 'meeting', name: 'Meeting Minutes' },
      { id: 'maintenance', name: 'Maintenance' },
      { id: 'reports', name: 'Reports' },
      { id: 'general', name: 'General' }
    ];
  }
};
