import { supabase } from '@/integrations/supabase/client';
import { DocumentFile, DocumentCategory } from '@/types/documents';
import { toast } from 'sonner';
import { validateFileSize, validateFileType } from '@/utils/supabase/storage/validators';
import { ensureDocumentsBucketExists } from '@/utils/documents/bucketUtils';
import { v4 as uuidv4 } from 'uuid';

interface UploadDocumentParams {
  file: File;
  associationId: string;
  description?: string;
  category?: string;
  tags?: string[];
  isPublic?: boolean;
}

/**
 * Fetch available document categories from the system
 * @returns Promise resolving to an array of category IDs
 */
export const getDocumentCategories = async (): Promise<string[]> => {
  try {
    // First try to get categories from database
    const { data, error } = await supabase
      .from('document_categories')
      .select('id, name')
      .order('name');
    
    if (error) {
      console.error('Error fetching document categories:', error);
      // Fall back to default categories
      return ['financial', 'legal', 'meeting', 'maintenance', 'reports', 'general'];
    }
    
    if (data && data.length > 0) {
      return data.map(category => category.id);
    }
    
    // If no categories in database, return defaults
    return ['financial', 'legal', 'meeting', 'maintenance', 'reports', 'general'];
  } catch (error) {
    console.error('Error in getDocumentCategories:', error);
    // Fall back to default categories
    return ['financial', 'legal', 'meeting', 'maintenance', 'reports', 'general'];
  }
};

export const getDocuments = async (
  associationId: string,
  category?: string
): Promise<DocumentFile[]> => {
  try {
    let query = supabase
      .from('documents')
      .select('*')
      .eq('association_id', associationId)
      .eq('is_archived', false);
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query.order('uploaded_date', { ascending: false });
    
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
      fileType: doc.file_type,
      url: doc.url,
      category: doc.category,
      tags: doc.tags || [],
      uploadedBy: doc.uploaded_by,
      uploadedDate: doc.uploaded_date,
      lastModified: doc.last_modified,
      version: doc.version,
      isPublic: doc.is_public,
      isArchived: doc.is_archived
    }));
  } catch (error) {
    console.error('Error in getDocuments:', error);
    throw new Error('Failed to fetch documents');
  }
};

export const uploadDocument = async ({
  file,
  associationId,
  description,
  category = 'general',
  tags,
  isPublic = false
}: UploadDocumentParams): Promise<DocumentFile | null> => {
  try {
    // Validate the file
    if (!validateFileSize(file, 50)) { // 50MB limit
      return null;
    }
    
    validateFileType(file, ['*/*']); // Allow all file types
    
    // Ensure documents bucket exists
    const bucketExists = await ensureDocumentsBucketExists();
    if (!bucketExists) {
      toast.error('Document storage is not available');
      return null;
    }
    
    // Generate unique file path
    const fileExtension = file.name.split('.').pop() || '';
    const uniqueId = uuidv4();
    const fileName = `${uniqueId}.${fileExtension}`;
    const uploadPath = `associations/${associationId}/${category}/${fileName}`;
    
    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(uploadPath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      toast.error(`Failed to upload document: ${uploadError.message}`);
      return null;
    }
    
    // Get the file URL
    const { data: urlData } = await supabase.storage
      .from('documents')
      .getPublicUrl(uploadData.path);
    
    const publicUrl = urlData?.publicUrl || '';
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in to upload documents');
      return null;
    }
    
    // Save document metadata to the documents table
    const { data: documentData, error: documentError } = await supabase
      .from('documents')
      .insert({
        name: file.name,
        description: description || null,
        file_size: file.size,
        file_type: file.type,
        url: publicUrl,
        category: category,
        tags: tags && tags.length > 0 ? tags : null,
        uploaded_by: user.id,
        association_id: associationId,
        is_public: isPublic,
        version: 1
      })
      .select()
      .single();
    
    if (documentError) {
      console.error('Error saving document metadata:', documentError);
      toast.error(`Failed to save document metadata: ${documentError.message}`);
      
      // Try to delete the uploaded file
      await supabase.storage.from('documents').remove([uploadPath]);
      return null;
    }
    
    // Return the uploaded document in our DocumentFile format
    return {
      id: documentData.id,
      name: documentData.name,
      description: documentData.description || '',
      fileSize: documentData.file_size,
      fileType: documentData.file_type,
      url: documentData.url,
      category: documentData.category,
      tags: documentData.tags || [],
      uploadedBy: documentData.uploaded_by,
      uploadedDate: documentData.uploaded_date,
      version: documentData.version,
      isPublic: documentData.is_public,
      isArchived: false
    };
  } catch (error) {
    console.error('Error in uploadDocument:', error);
    toast.error('An unexpected error occurred during upload');
    return null;
  }
};

export const deleteDocument = async (documentId: string): Promise<boolean> => {
  try {
    // First get the document details to get the file path
    const { data: document, error: getError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();
    
    if (getError) {
      console.error('Error getting document details:', getError);
      toast.error(`Failed to get document details: ${getError.message}`);
      return false;
    }
    
    // Delete document record from the database
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);
    
    if (deleteError) {
      console.error('Error deleting document:', deleteError);
      toast.error(`Failed to delete document: ${deleteError.message}`);
      return false;
    }
    
    // Try to delete the file from storage if URL contains path information
    try {
      const url = document.url;
      if (url && url.includes('supabase.co')) {
        // Extract the path from the URL
        const urlParts = url.split('/');
        const bucketName = 'documents';
        // The path is everything after the bucket name in the URL
        const pathIndex = urlParts.findIndex(part => part === bucketName) + 1;
        if (pathIndex > 0 && pathIndex < urlParts.length) {
          const path = urlParts.slice(pathIndex).join('/');
          await supabase.storage.from(bucketName).remove([path]);
        }
      }
    } catch (storageError) {
      console.error('Error deleting file from storage:', storageError);
      // Continue anyway since the record is deleted
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteDocument:', error);
    toast.error('An unexpected error occurred while deleting the document');
    return false;
  }
};

export const downloadDocument = async (url: string, filename: string): Promise<boolean> => {
  try {
    if (!url) {
      toast.error('Document URL is not available');
      return false;
    }
    
    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // Add to DOM, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error downloading document:', error);
    toast.error('Failed to download document');
    return false;
  }
};

export const updateDocumentMetadata = async (
  documentId: string,
  metadata: {
    name?: string;
    description?: string;
    category?: string;
    tags?: string[];
    isPublic?: boolean;
  }
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('documents')
      .update({
        name: metadata.name,
        description: metadata.description,
        category: metadata.category,
        tags: metadata.tags,
        is_public: metadata.isPublic,
        last_modified: new Date().toISOString()
      })
      .eq('id', documentId);
    
    if (error) {
      console.error('Error updating document metadata:', error);
      toast.error(`Failed to update document: ${error.message}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateDocumentMetadata:', error);
    toast.error('An unexpected error occurred while updating the document');
    return false;
  }
};
