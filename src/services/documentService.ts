
import { supabase } from '@/integrations/supabase/client';
import { ensureBucketExists } from '@/utils/documents/policyUtils';
import { toast } from 'sonner';

// Define interface for document metadata
export interface DocumentMetadata {
  id: string;
  name: string;
  description?: string;
  associationId: string;
  category?: string;
  tags?: string[];
  uploadedBy: string;
  uploadedDate: string;
  fileType: string;
  fileSize: number;
  url: string;
  isPublic?: boolean;
}

export const documentService = {
  /**
   * Initialize storage for documents
   */
  async initStorage(): Promise<boolean> {
    try {
      // Check if 'documents' bucket exists, create if not
      const bucketExists = await ensureBucketExists('documents', false, false);
      return bucketExists;
    } catch (error) {
      console.error('Error initializing document storage:', error);
      return false;
    }
  },

  /**
   * Upload a document to a specific association's folder
   * @param file File to upload
   * @param associationId Association ID
   * @param metadata Optional metadata for the file
   * @returns Document metadata if successful
   */
  async uploadDocument(
    file: File,
    associationId: string,
    userId: string,
    metadata: Partial<DocumentMetadata> = {}
  ): Promise<DocumentMetadata | null> {
    try {
      // Ensure the bucket exists
      await this.initStorage();

      // Create a unique file path within the association's folder
      const fileExt = file.name.split('.').pop() || '';
      const timestamp = new Date().getTime();
      const randomId = Math.random().toString(36).substring(2, 10);
      const fileName = `${timestamp}-${randomId}.${fileExt}`;
      
      // Create path using the storage function defined in SQL
      const associationPath = `associations/${associationId}`;
      const filePath = `${associationPath}/${fileName}`;

      // Upload file to Supabase storage
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get URL for the uploaded file
      const { data: urlData } = await supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Create document metadata
      const documentMetadata: DocumentMetadata = {
        id: randomId,
        name: metadata.name || file.name,
        description: metadata.description || '',
        associationId,
        category: metadata.category || 'general',
        tags: metadata.tags || [],
        uploadedBy: userId,
        uploadedDate: new Date().toISOString(),
        fileType: fileExt,
        fileSize: file.size,
        url: urlData.publicUrl,
        isPublic: metadata.isPublic || false
      };

      // Store document metadata in the database
      const { data: metadataData, error: metadataError } = await supabase
        .from('documents')
        .insert({
          id: documentMetadata.id,
          name: documentMetadata.name,
          description: documentMetadata.description,
          association_id: documentMetadata.associationId,
          category: documentMetadata.category,
          tags: documentMetadata.tags,
          uploaded_by: documentMetadata.uploadedBy,
          uploaded_date: documentMetadata.uploadedDate,
          file_type: documentMetadata.fileType,
          file_size: documentMetadata.fileSize,
          url: documentMetadata.url,
          is_public: documentMetadata.isPublic
        })
        .select()
        .single();

      if (metadataError) {
        // If metadata storage fails, delete the uploaded file
        await supabase.storage
          .from('documents')
          .remove([filePath]);
        throw metadataError;
      }

      toast.success('Document uploaded successfully');
      return documentMetadata;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
      return null;
    }
  },

  /**
   * Get documents for a specific association
   * @param associationId Association ID
   * @param category Optional category filter
   * @returns Array of document metadata
   */
  async getDocuments(
    associationId: string,
    category?: string
  ): Promise<DocumentMetadata[]> {
    try {
      let query = supabase
        .from('documents')
        .select('*')
        .eq('association_id', associationId)
        .eq('is_archived', false);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query.order('uploaded_date', { ascending: false });

      if (error) {
        throw error;
      }

      return data.map(doc => ({
        id: doc.id,
        name: doc.name,
        description: doc.description,
        associationId: doc.association_id,
        category: doc.category,
        tags: doc.tags,
        uploadedBy: doc.uploaded_by,
        uploadedDate: doc.uploaded_date,
        fileType: doc.file_type,
        fileSize: doc.file_size,
        url: doc.url,
        isPublic: doc.is_public
      }));
    } catch (error) {
      console.error('Error fetching documents:', error);
      return [];
    }
  },

  /**
   * Delete a document
   * @param id Document ID to delete
   * @param associationId Association ID for validation
   * @returns Success status
   */
  async deleteDocument(id: string, associationId: string): Promise<boolean> {
    try {
      // First get the document to find its path
      const { data: doc, error: fetchError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .eq('association_id', associationId)
        .single();

      if (fetchError || !doc) {
        throw fetchError || new Error('Document not found');
      }

      // Extract the file path from the URL
      const url = new URL(doc.url);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(pathParts.indexOf('documents') + 1).join('/');

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath]);

      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
        // Continue anyway to try to delete the metadata
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)
        .eq('association_id', associationId);

      if (dbError) {
        throw dbError;
      }

      toast.success('Document deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
      return false;
    }
  }
};
