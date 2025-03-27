
import { supabase } from '@/integrations/supabase/client';
import { DocumentFile, DocumentSearchFilters, DocumentAccessLevel } from '@/types/documents';

/**
 * Get documents based on filters, association and user role
 * @param filters Search filters
 * @param associationId Association ID
 * @param userRole User role for access control
 * @returns Promise<DocumentFile[]> Array of documents
 */
export const getDocuments = async (
  filters: DocumentSearchFilters = {}, 
  associationId?: string,
  userRole?: string
): Promise<DocumentFile[]> => {
  try {
    console.log('Getting documents with filters:', filters);
    
    let query = supabase
      .from('documents')
      .select('*');
    
    // Apply association filter if provided
    if (associationId) {
      query = query.eq('association_id', associationId);
    }
    
    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      query = query.in('category', filters.categories);
    }
    
    // Apply search query
    if (filters.query && filters.query.trim() !== '') {
      const searchTerm = `%${filters.query.toLowerCase()}%`;
      query = query.or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`);
    }
    
    // Apply tag filter
    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }
    
    // Apply date range filter
    if (filters.dateRange) {
      if (filters.dateRange.start) {
        query = query.gte('uploaded_date', filters.dateRange.start);
      }
      if (filters.dateRange.end) {
        query = query.lte('uploaded_date', filters.dateRange.end);
      }
    }
    
    // Get documents
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching documents:', error);
      return [];
    }
    
    // Convert to DocumentFile format
    const documents: DocumentFile[] = data.map(doc => ({
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
      isPublic: doc.is_public || false,
      isArchived: doc.is_archived || false,
      associations: [associationId || ''],
      properties: [],
      metadata: {}
    }));
    
    // Role-based filtering (if needed)
    if (userRole) {
      // Filter based on user role and document access level
      // This is just a placeholder - implement actual access control as needed
      return documents;
    }
    
    return documents;
  } catch (error) {
    console.error('Unexpected error fetching documents:', error);
    return [];
  }
};

/**
 * Get a single document by ID
 * @param documentId Document ID
 * @returns Promise<DocumentFile | null> Document or null
 */
export const getDocumentById = async (documentId: string): Promise<DocumentFile | null> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();
    
    if (error || !data) {
      console.error('Error fetching document:', error);
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      fileSize: data.file_size,
      fileType: data.file_type,
      url: data.url,
      category: data.category || 'uncategorized',
      tags: data.tags || [],
      uploadedBy: data.uploaded_by || '',
      uploadedDate: data.uploaded_date || new Date().toISOString(),
      lastModified: data.last_modified || new Date().toISOString(),
      version: data.version || 1,
      isPublic: data.is_public || false,
      isArchived: data.is_archived || false,
      associations: [data.association_id || ''],
      properties: [],
      metadata: {}
    };
    
  } catch (error) {
    console.error('Unexpected error fetching document:', error);
    return null;
  }
};

/**
 * Delete a document by ID
 * @param documentId Document ID
 * @returns Promise<boolean> Success status
 */
export const deleteDocument = async (documentId: string): Promise<boolean> => {
  try {
    // Get the document to find its file path
    const { data, error } = await supabase
      .from('documents')
      .select('url, category')
      .eq('id', documentId)
      .single();
    
    if (error || !data) {
      console.error('Error fetching document for deletion:', error);
      return false;
    }
    
    // Extract file path from URL or use it directly if it's already a path
    const filePath = data.url.includes('/')
      ? data.url.split('/').slice(-2).join('/')  // Get last two segments
      : `${data.category}/${data.url}`;
    
    // Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([filePath]);
    
    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      // Continue to delete the database record even if file deletion fails
    }
    
    // Delete the database record
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);
    
    if (dbError) {
      console.error('Error deleting document record:', dbError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error deleting document:', error);
    return false;
  }
};
