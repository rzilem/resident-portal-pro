
import { supabase } from '@/integrations/supabase/client';
import { DocumentFile, DocumentSearchFilters } from '@/types/documents';

/**
 * Search for documents based on filters
 * @param query Search query
 * @param filters Additional search filters
 * @returns Promise<DocumentFile[]> The search results
 */
export const searchDocuments = async (
  query: string, 
  filters: Partial<DocumentSearchFilters> = {}
): Promise<DocumentFile[]> => {
  try {
    console.log('Searching for documents with query:', query, 'and filters:', filters);
    
    let supabaseQuery = supabase
      .from('documents')
      .select('*');
    
    // Apply text search if provided
    if (query && query.trim() !== '') {
      const searchTerm = `%${query.toLowerCase()}%`;
      supabaseQuery = supabaseQuery.or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`);
    }
    
    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      supabaseQuery = supabaseQuery.in('category', filters.categories);
    }
    
    // Apply file types filter
    if (filters.fileTypes && filters.fileTypes.length > 0) {
      supabaseQuery = supabaseQuery.in('file_type', filters.fileTypes);
    }
    
    // Apply date range filter if provided
    if (filters.dateRange) {
      if (filters.dateRange.start) {
        supabaseQuery = supabaseQuery.gte('uploaded_date', filters.dateRange.start);
      }
      if (filters.dateRange.end) {
        supabaseQuery = supabaseQuery.lte('uploaded_date', filters.dateRange.end);
      }
    }
    
    // Apply upload user filter
    if (filters.uploadedBy && filters.uploadedBy.length > 0) {
      supabaseQuery = supabaseQuery.in('uploaded_by', filters.uploadedBy);
    }
    
    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      supabaseQuery = supabaseQuery.overlaps('tags', filters.tags);
    }
    
    // Apply associations filter
    if (filters.associations && filters.associations.length > 0) {
      supabaseQuery = supabaseQuery.in('association_id', filters.associations);
    }
    
    // Apply public/archived filters if specified
    if (filters.isPublic !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_public', filters.isPublic);
    }
    
    if (filters.isArchived !== undefined) {
      supabaseQuery = supabaseQuery.eq('is_archived', filters.isArchived);
    }
    
    // Execute query
    const { data, error } = await supabaseQuery;
    
    if (error) {
      console.error('Error searching documents:', error);
      return [];
    }
    
    // Map database results to DocumentFile type
    return data.map(doc => ({
      id: doc.id,
      name: doc.name,
      description: doc.description || '',
      fileSize: doc.file_size,
      fileType: doc.file_type,
      url: doc.url,
      category: doc.category || 'uncategorized',
      tags: doc.tags || [],
      uploadedBy: doc.uploaded_by || '',
      uploadedDate: doc.uploaded_date || new Date().toISOString(),
      lastModified: doc.last_modified || new Date().toISOString(),
      version: doc.version || 1,
      isPublic: Boolean(doc.is_public) || false,
      isArchived: Boolean(doc.is_archived) || false,
      associations: [doc.association_id].filter(Boolean) || [],
      properties: [],
      metadata: {}
    }));
    
  } catch (error) {
    console.error('Unexpected error searching documents:', error);
    return [];
  }
};

/**
 * Get document tags for filtering
 * @returns Promise<string[]> Available tag options
 */
export const getDocumentTags = async (): Promise<string[]> => {
  try {
    // This query uses Postgres array_agg and unnest to get unique tags
    const { data, error } = await supabase
      .rpc('get_unique_document_tags');
    
    if (error) {
      console.error('Error fetching document tags:', error);
      // Fallback to default tags if RPC not available
      return ['financial', 'legal', 'meeting', 'maintenance', 'important'];
    }
    
    return data || [];
    
  } catch (error) {
    console.error('Unexpected error fetching document tags:', error);
    return ['financial', 'legal', 'meeting', 'maintenance', 'important'];
  }
};
