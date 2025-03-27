
/**
 * Database utilities for document management
 */

import { supabase } from '@/integrations/supabase/client';
import { DocumentFile, DocumentSearchFilters } from '@/types/documents';
import { toast } from 'sonner';
import { getDownloadUrl } from './bucketUtils';

/**
 * Create a document record in the database
 * @param {Partial<DocumentFile>} documentData - Document data
 * @returns {Promise<DocumentFile | null>} Created document or null
 */
export const createDocument = async (documentData: Partial<DocumentFile>): Promise<DocumentFile | null> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .insert([documentData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating document record:', error);
      return null;
    }
    
    return data as DocumentFile;
  } catch (error) {
    console.error('Exception in createDocument:', error);
    return null;
  }
};

/**
 * Get document by ID
 * @param {string} id - Document ID
 * @returns {Promise<DocumentFile | null>} Document or null
 */
export const getDocumentById = async (id: string): Promise<DocumentFile | null> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error getting document by ID:', error);
      return null;
    }
    
    // Get the download URL for the document
    if (data && data.path) {
      try {
        data.url = await getDownloadUrl(data.path);
      } catch (urlError) {
        console.error('Error generating download URL:', urlError);
        data.url = ''; // Set empty URL if we can't generate one
      }
    }
    
    return data as DocumentFile;
  } catch (error) {
    console.error('Exception in getDocumentById:', error);
    return null;
  }
};

/**
 * Get documents with optional filtering
 * @param {DocumentSearchFilters} filters - Search and filter criteria
 * @param {string} [associationId] - Optional association ID to filter by
 * @param {string} [userRole] - User role for access control
 * @returns {Promise<DocumentFile[]>} Array of matching documents
 */
export const getDocuments = async (
  filters: DocumentSearchFilters = {}, 
  associationId?: string,
  userRole?: string
): Promise<DocumentFile[]> => {
  try {
    console.log('Getting documents with filters:', JSON.stringify(filters), 'associationId:', associationId, 'userRole:', userRole);
    
    // Start with base query
    let query = supabase
      .from('documents')
      .select('*')
      .order('uploadedDate', { ascending: false });
    
    // Apply filters
    if (filters.query) {
      query = query.or(`name.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
    }
    
    if (filters.categories && filters.categories.length > 0) {
      query = query.in('category', filters.categories);
    }
    
    if (filters.fileTypes && filters.fileTypes.length > 0) {
      query = query.in('fileType', filters.fileTypes);
    }
    
    if (filters.tags && filters.tags.length > 0) {
      // Note: This assumes the tags column is an array type in the database
      query = query.overlaps('tags', filters.tags);
    }
    
    if (filters.dateRange) {
      if (filters.dateRange.start) {
        query = query.gte('uploadedDate', filters.dateRange.start);
      }
      if (filters.dateRange.end) {
        query = query.lte('uploadedDate', filters.dateRange.end);
      }
    }
    
    if (filters.uploadedBy && filters.uploadedBy.length > 0) {
      query = query.in('uploadedBy', filters.uploadedBy);
    }
    
    if (associationId) {
      // For now, assume the documents table has an associationId column
      // In a real application, this might be more complex, e.g., a junction table
      query = query.eq('associationId', associationId);
    }
    
    // Apply access level filtering based on user role
    if (userRole) {
      // Implement role-based access filtering logic
      // This is just a placeholder - your actual implementation will depend on your 
      // role structure and data model
      if (userRole !== 'admin' && userRole !== 'manager') {
        // If not admin/manager, filter out restricted documents
        query = query.neq('accessLevel', 'management');
        
        if (userRole !== 'board_member') {
          // If not board member, filter out board-only documents
          query = query.neq('accessLevel', 'board');
        }
      }
    }
    
    // Exclude archived documents unless specifically requested
    if (filters.isArchived === undefined || filters.isArchived === false) {
      query = query.eq('isArchived', false);
    }
    
    // Get the results
    const { data, error } = await query;
    
    if (error) {
      console.error('Error getting documents:', error);
      return [];
    }
    
    // Since we'll need download URLs for all documents, process them in parallel
    const documentsWithUrls = await Promise.all(data.map(async (doc) => {
      if (doc.path) {
        try {
          doc.url = await getDownloadUrl(doc.path);
        } catch (urlError) {
          console.error(`Error generating URL for document ${doc.id}:`, urlError);
          doc.url = ''; // Set empty URL if we can't generate one
        }
      } else {
        doc.url = ''; // Default empty URL
      }
      return doc;
    }));
    
    console.log(`Found ${documentsWithUrls.length} documents`);
    return documentsWithUrls as DocumentFile[];
  } catch (error) {
    console.error('Exception in getDocuments:', error);
    return [];
  }
};

/**
 * Update document metadata
 * @param {string} id - Document ID
 * @param {Partial<DocumentFile>} updates - Fields to update
 * @returns {Promise<DocumentFile | null>} Updated document or null
 */
export const updateDocument = async (
  id: string, 
  updates: Partial<DocumentFile>
): Promise<DocumentFile | null> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update document');
      return null;
    }
    
    return data as DocumentFile;
  } catch (error) {
    console.error('Exception in updateDocument:', error);
    return null;
  }
};

/**
 * Delete document by ID
 * @param {string} id - Document ID
 * @param {boolean} [hardDelete=false] - If true, actually deletes the record, otherwise marks as archived
 * @returns {Promise<boolean>} True if deleted
 */
export const deleteDocument = async (id: string, hardDelete: boolean = false): Promise<boolean> => {
  try {
    // Get the document first to know its storage path
    const document = await getDocumentById(id);
    if (!document) {
      console.error('Document not found for deletion:', id);
      return false;
    }
    
    let success = false;
    
    if (hardDelete) {
      // Actually delete the record
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting document record:', error);
        return false;
      }
      
      success = true;
    } else {
      // Soft delete - mark as archived
      const { error } = await supabase
        .from('documents')
        .update({ isArchived: true })
        .eq('id', id);
      
      if (error) {
        console.error('Error archiving document:', error);
        return false;
      }
      
      success = true;
    }
    
    // If the database operation was successful and we have a storage path,
    // also remove the file from storage (for hard deletes only)
    if (success && hardDelete && document.path) {
      try {
        const { error } = await supabase.storage
          .from('documents')
          .remove([document.path]);
        
        if (error) {
          console.error('Error removing file from storage:', error);
          // We still consider this a success since the database record was deleted
        }
      } catch (storageError) {
        console.error('Exception removing file from storage:', storageError);
        // Still a success since the database record was deleted
      }
    }
    
    return success;
  } catch (error) {
    console.error('Exception in deleteDocument:', error);
    return false;
  }
};

/**
 * Update document access level
 * @param {string} id - Document ID 
 * @param {string} accessLevel - New access level
 * @returns {Promise<boolean>} True if updated
 */
export const updateDocumentAccessLevel = async (
  id: string,
  accessLevel: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('documents')
      .update({ accessLevel })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating document access level:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in updateDocumentAccessLevel:', error);
    return false;
  }
};

/**
 * Get all unique tags used in documents
 * @returns {Promise<string[]>} Array of unique tags
 */
export const getAllDocumentTags = async (): Promise<string[]> => {
  try {
    // This assumes the tags are stored as an array in each document record
    // The approach depends on your database schema
    const { data, error } = await supabase
      .from('documents')
      .select('tags');
    
    if (error) {
      console.error('Error fetching document tags:', error);
      return [];
    }
    
    // Flatten array of arrays and filter out duplicates
    const allTags = data.flatMap(doc => doc.tags || []);
    const uniqueTags = [...new Set(allTags)];
    
    return uniqueTags;
  } catch (error) {
    console.error('Exception in getAllDocumentTags:', error);
    return [];
  }
};

/**
 * Get document statistics
 * @param {string} [associationId] - Optional association ID to filter by
 * @returns {Promise<{total: number, byCategory: Record<string, number>, byType: Record<string, number>}>} Document statistics
 */
export const getDocumentStatistics = async (associationId?: string): Promise<{
  total: number,
  byCategory: Record<string, number>,
  byType: Record<string, number>,
  recent: number
}> => {
  try {
    // Base query
    let query = supabase
      .from('documents')
      .select('*')
      .eq('isArchived', false);
    
    // Filter by association if provided
    if (associationId) {
      query = query.eq('associationId', associationId);
    }
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      console.error('Error getting document statistics:', error);
      return { total: 0, byCategory: {}, byType: {}, recent: 0 };
    }
    
    // Calculate statistics
    const byCategory: Record<string, number> = {};
    const byType: Record<string, number> = {};
    let recent = 0;
    
    // Current date minus 30 days for recent count
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    data.forEach(doc => {
      // Count by category
      const category = doc.category || 'uncategorized';
      byCategory[category] = (byCategory[category] || 0) + 1;
      
      // Count by file type
      const fileType = doc.fileType || 'unknown';
      byType[fileType] = (byType[fileType] || 0) + 1;
      
      // Count recent documents
      const uploadDate = new Date(doc.uploadedDate);
      if (uploadDate >= thirtyDaysAgo) {
        recent++;
      }
    });
    
    return {
      total: data.length,
      byCategory,
      byType,
      recent
    };
  } catch (error) {
    console.error('Exception in getDocumentStatistics:', error);
    return { total: 0, byCategory: {}, byType: {}, recent: 0 };
  }
};
