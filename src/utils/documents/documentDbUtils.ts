
/**
 * Database utilities for document management
 */

import { supabase } from '@/integrations/supabase/client';
import { DocumentFile, DocumentSearchFilters } from '@/types/documents';
import { toast } from 'sonner';
import { getDownloadUrl } from './bucketUtils';

/**
 * Map database object to DocumentFile type
 * @param {any} dbObject - Database object with snake_case properties
 * @returns {DocumentFile} Document with camelCase properties
 */
const mapDbObjectToDocumentFile = (dbObject: any): DocumentFile => {
  return {
    id: dbObject.id,
    name: dbObject.name,
    description: dbObject.description || '',
    fileSize: dbObject.file_size,
    fileType: dbObject.file_type,
    url: dbObject.url || '',
    path: dbObject.url, // Using url field as path
    category: dbObject.category || 'uncategorized',
    tags: dbObject.tags || [],
    uploadedBy: dbObject.uploaded_by,
    uploadedDate: dbObject.uploaded_date,
    lastModified: dbObject.last_modified,
    version: dbObject.version || 1,
    isPublic: dbObject.is_public || false,
    isArchived: dbObject.is_archived || false,
    associationId: dbObject.association_id
  };
};

/**
 * Map DocumentFile type to database object
 * @param {Partial<DocumentFile>} documentData - Document data with camelCase properties
 * @returns {any} Database object with snake_case properties
 */
const mapDocumentFileToDbObject = (documentData: Partial<DocumentFile>): any => {
  const dbObject: any = {};
  
  if (documentData.id !== undefined) dbObject.id = documentData.id;
  if (documentData.name !== undefined) dbObject.name = documentData.name;
  if (documentData.description !== undefined) dbObject.description = documentData.description;
  if (documentData.fileSize !== undefined) dbObject.file_size = documentData.fileSize;
  if (documentData.fileType !== undefined) dbObject.file_type = documentData.fileType;
  if (documentData.url !== undefined) dbObject.url = documentData.url;
  if (documentData.category !== undefined) dbObject.category = documentData.category;
  if (documentData.tags !== undefined) dbObject.tags = documentData.tags;
  if (documentData.uploadedBy !== undefined) dbObject.uploaded_by = documentData.uploadedBy;
  if (documentData.uploadedDate !== undefined) dbObject.uploaded_date = documentData.uploadedDate;
  if (documentData.lastModified !== undefined) dbObject.last_modified = documentData.lastModified;
  if (documentData.version !== undefined) dbObject.version = documentData.version;
  if (documentData.isPublic !== undefined) dbObject.is_public = documentData.isPublic;
  if (documentData.isArchived !== undefined) dbObject.is_archived = documentData.isArchived;
  if (documentData.associationId !== undefined) dbObject.association_id = documentData.associationId;
  
  return dbObject;
};

/**
 * Create a document record in the database
 * @param {Partial<DocumentFile>} documentData - Document data
 * @returns {Promise<DocumentFile | null>} Created document or null
 */
export const createDocument = async (documentData: Partial<DocumentFile>): Promise<DocumentFile | null> => {
  try {
    const dbObject = mapDocumentFileToDbObject(documentData);
    
    const { data, error } = await supabase
      .from('documents')
      .insert([dbObject])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating document record:', error);
      return null;
    }
    
    return mapDbObjectToDocumentFile(data);
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
    
    const document = mapDbObjectToDocumentFile(data);
    
    // Get the download URL for the document
    if (document && document.path) {
      try {
        document.url = await getDownloadUrl(document.path);
      } catch (urlError) {
        console.error('Error generating download URL:', urlError);
        document.url = ''; // Set empty URL if we can't generate one
      }
    }
    
    return document;
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
      .order('uploaded_date', { ascending: false });
    
    // Apply filters
    if (filters.query) {
      query = query.or(`name.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
    }
    
    if (filters.categories && filters.categories.length > 0) {
      query = query.in('category', filters.categories);
    }
    
    if (filters.fileTypes && filters.fileTypes.length > 0) {
      query = query.in('file_type', filters.fileTypes);
    }
    
    if (filters.tags && filters.tags.length > 0) {
      // Note: This assumes the tags column is an array type in the database
      query = query.overlaps('tags', filters.tags);
    }
    
    if (filters.dateRange) {
      if (filters.dateRange.start) {
        query = query.gte('uploaded_date', filters.dateRange.start);
      }
      if (filters.dateRange.end) {
        query = query.lte('uploaded_date', filters.dateRange.end);
      }
    }
    
    if (filters.uploadedBy && filters.uploadedBy.length > 0) {
      query = query.in('uploaded_by', filters.uploadedBy);
    }
    
    if (associationId) {
      // For now, assume the documents table has an associationId column
      // In a real application, this might be more complex, e.g., a junction table
      query = query.eq('association_id', associationId);
    }
    
    // Apply access level filtering based on user role
    if (userRole) {
      // Implement role-based access filtering logic
      // This is just a placeholder - your actual implementation will depend on your 
      // role structure and data model
      if (userRole !== 'admin' && userRole !== 'manager') {
        // If not admin/manager, filter out restricted documents
        query = query.neq('access_level', 'management');
        
        if (userRole !== 'board_member') {
          // If not board member, filter out board-only documents
          query = query.neq('access_level', 'board');
        }
      }
    }
    
    // Exclude archived documents unless specifically requested
    if (filters.isArchived === undefined || filters.isArchived === false) {
      query = query.eq('is_archived', false);
    }
    
    // Get the results
    const { data, error } = await query;
    
    if (error) {
      console.error('Error getting documents:', error);
      return [];
    }
    
    // Map database objects to DocumentFile interface
    const documents = data.map(item => mapDbObjectToDocumentFile(item));
    
    // Since we'll need download URLs for all documents, process them in parallel
    const documentsWithUrls = await Promise.all(documents.map(async (doc) => {
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
    return documentsWithUrls;
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
    const dbObject = mapDocumentFileToDbObject(updates);
    
    const { data, error } = await supabase
      .from('documents')
      .update(dbObject)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update document');
      return null;
    }
    
    return mapDbObjectToDocumentFile(data);
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
        .update({ is_archived: true })
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
      .update({ access_level: accessLevel })
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
      .eq('is_archived', false);
    
    // Filter by association if provided
    if (associationId) {
      query = query.eq('association_id', associationId);
    }
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      console.error('Error getting document statistics:', error);
      return { total: 0, byCategory: {}, byType: {}, recent: 0 };
    }
    
    // Map database results to DocumentFile objects
    const documents = data.map(item => mapDbObjectToDocumentFile(item));
    
    // Calculate statistics
    const byCategory: Record<string, number> = {};
    const byType: Record<string, number> = {};
    let recent = 0;
    
    // Current date minus 30 days for recent count
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    documents.forEach(doc => {
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
      total: documents.length,
      byCategory,
      byType,
      recent
    };
  } catch (error) {
    console.error('Exception in getDocumentStatistics:', error);
    return { total: 0, byCategory: {}, byType: {}, recent: 0 };
  }
};
