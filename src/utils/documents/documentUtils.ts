/**
 * Utility functions for document operations
 */

import { supabase } from '@/integrations/supabase/client';
import { debugLog, errorLog } from '@/utils/debug';
import { DocumentFile } from '@/types/documents';
import { getDownloadUrl } from './uploadUtils';
import { formatFileSize, formatDate } from './fileUtils';

/**
 * Get documents by association ID
 * @param associationId - Association ID
 * @returns Promise<DocumentFile[]> Array of documents
 */
export const getDocumentsByAssociation = async (associationId: string): Promise<DocumentFile[]> => {
  try {
    if (!associationId) {
      errorLog("No association ID provided");
      return [];
    }
    
    debugLog(`Fetching documents for association: ${associationId}`);
    
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('association_id', associationId)
      .eq('is_archived', false)
      .order('uploaded_date', { ascending: false });
    
    if (error) {
      errorLog("Error fetching documents:", error);
      return [];
    }
    
    debugLog(`Found ${data.length} documents for association ${associationId}`);
    
    // Transform data to match DocumentFile interface
    return data.map(doc => ({
      id: doc.id,
      name: doc.name,
      description: doc.description || '',
      fileSize: doc.file_size,
      fileType: doc.file_type,
      url: doc.url,
      category: doc.category || 'uncategorized',
      tags: doc.tags || [],
      uploadedBy: doc.uploaded_by,
      uploadedDate: doc.uploaded_date,
      lastModified: doc.last_modified || doc.uploaded_date,
      version: doc.version || 1,
      isPublic: !!doc.is_public,
      isArchived: false,
      associations: [associationId]
    }));
  } catch (error) {
    errorLog("Exception in getDocumentsByAssociation:", error);
    return [];
  }
};

/**
 * Search documents by criteria
 * @param criteria Search criteria
 * @returns Promise<DocumentFile[]> Array of documents
 */
export const searchDocuments = async (criteria: {
  query?: string,
  categories?: string[],
  associationId?: string
}): Promise<DocumentFile[]> => {
  try {
    let query = supabase
      .from('documents')
      .select('*')
      .eq('is_archived', false);
    
    if (criteria.associationId) {
      query = query.eq('association_id', criteria.associationId);
    }
    
    if (criteria.categories && criteria.categories.length > 0) {
      query = query.in('category', criteria.categories);
    }
    
    if (criteria.query) {
      query = query.or(`name.ilike.%${criteria.query}%,description.ilike.%${criteria.query}%`);
    }
    
    const { data, error } = await query.order('uploaded_date', { ascending: false });
    
    if (error) {
      errorLog("Error searching documents:", error);
      return [];
    }
    
    // Transform data to match DocumentFile interface
    return data.map(doc => ({
      id: doc.id,
      name: doc.name,
      description: doc.description || '',
      fileSize: doc.file_size,
      fileType: doc.file_type,
      url: doc.url,
      category: doc.category || 'uncategorized',
      tags: doc.tags || [],
      uploadedBy: doc.uploaded_by,
      uploadedDate: doc.uploaded_date,
      lastModified: doc.last_modified || doc.uploaded_date,
      version: doc.version || 1,
      isPublic: !!doc.is_public,
      isArchived: false,
      associations: [doc.association_id]
    }));
  } catch (error) {
    errorLog("Exception in searchDocuments:", error);
    return [];
  }
};

/**
 * Get document metadata by ID
 * @param documentId Document ID
 * @returns Promise<DocumentFile|null> Document metadata or null if not found
 */
export const getDocumentById = async (documentId: string): Promise<DocumentFile | null> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();
    
    if (error) {
      errorLog("Error fetching document:", error);
      return null;
    }
    
    if (!data) {
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
      uploadedBy: data.uploaded_by,
      uploadedDate: data.uploaded_date,
      lastModified: data.last_modified || data.uploaded_date,
      version: data.version || 1,
      isPublic: !!data.is_public,
      isArchived: !!data.is_archived,
      associations: [data.association_id]
    };
  } catch (error) {
    errorLog("Exception in getDocumentById:", error);
    return null;
  }
};

/**
 * Download a document by ID
 * @param documentId Document ID
 * @returns Promise<void>
 */
export const downloadDocument = async (documentId: string): Promise<void> => {
  try {
    const document = await getDocumentById(documentId);
    
    if (!document) {
      throw new Error("Document not found");
    }
    
    // If it's a direct public URL, we can download directly
    if (document.url.startsWith('http')) {
      window.open(document.url, '_blank');
      return;
    }
    
    // Otherwise, get a download URL from Supabase
    const downloadUrl = await getDownloadUrl(document.url);
    window.open(downloadUrl, '_blank');
  } catch (error) {
    errorLog("Error downloading document:", error);
    throw error;
  }
};
