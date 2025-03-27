
/**
 * Utility functions for document database operations
 */

import { supabase } from '@/integrations/supabase/client';
import { debugLog, errorLog } from '@/utils/debug';

/**
 * Save document metadata to the database
 * @param documentData Document metadata
 * @returns Promise<{ success: boolean, id?: string, error?: string }>
 */
export const saveDocumentMetadata = async (documentData: any): Promise<{ success: boolean, id?: string, error?: string }> => {
  try {
    debugLog("Saving document metadata:", documentData);
    
    // Check for required fields
    if (!documentData.name || !documentData.file_size || !documentData.file_type || !documentData.url) {
      return { 
        success: false, 
        error: "Missing required document metadata" 
      };
    }
    
    const { data, error } = await supabase
      .from('documents')
      .insert(documentData)
      .select('id')
      .single();
    
    if (error) {
      errorLog("Error saving document metadata:", error);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    if (!data) {
      return { 
        success: false, 
        error: "Document saved but no ID returned" 
      };
    }
    
    debugLog("Document metadata saved successfully:", data);
    return { 
      success: true, 
      id: data.id 
    };
  } catch (error) {
    errorLog("Exception in saveDocumentMetadata:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error saving document metadata" 
    };
  }
};

/**
 * Update document metadata
 * @param documentId Document ID
 * @param updates Document updates
 * @returns Promise<boolean> Success status
 */
export const updateDocumentMetadata = async (documentId: string, updates: any): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', documentId);
    
    if (error) {
      errorLog("Error updating document metadata:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    errorLog("Exception in updateDocumentMetadata:", error);
    return false;
  }
};

/**
 * Update document access level
 * @param documentId Document ID
 * @param isPublic Whether the document is public
 * @returns Promise<boolean> Success status
 */
export const updateDocumentAccess = async (documentId: string, isPublic: boolean): Promise<boolean> => {
  try {
    return await updateDocumentMetadata(documentId, { is_public: isPublic });
  } catch (error) {
    errorLog("Exception in updateDocumentAccess:", error);
    return false;
  }
};

/**
 * Delete a document
 * @param documentId Document ID
 * @returns Promise<boolean> Success status
 */
export const deleteDocument = async (documentId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);
    
    if (error) {
      errorLog("Error deleting document:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    errorLog("Exception in deleteDocument:", error);
    return false;
  }
};

/**
 * Archive a document
 * @param documentId Document ID
 * @returns Promise<boolean> Success status
 */
export const archiveDocument = async (documentId: string): Promise<boolean> => {
  try {
    return await updateDocumentMetadata(documentId, { 
      is_archived: true,
      last_modified: new Date().toISOString()
    });
  } catch (error) {
    errorLog("Exception in archiveDocument:", error);
    return false;
  }
};
