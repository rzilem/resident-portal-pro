
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Document {
  id?: string;
  name: string;
  description?: string;
  file_size: number;
  file_type: string;
  url: string;
  category?: string;
  tags?: string[];
  association_id: string;
  is_public?: boolean;
  is_archived?: boolean;
  version?: number;
  uploaded_date?: string;
  uploaded_by?: string;
}

/**
 * Service for managing documents in Supabase
 */
export const documentsService = {
  /**
   * Upload a document to Supabase storage and create a database record
   */
  async uploadDocument(
    file: File, 
    metadata: { 
      description?: string; 
      category?: string; 
      tags?: string[]; 
      association_id: string;
      is_public?: boolean;
    }
  ): Promise<Document | null> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        toast.error('You must be logged in to upload documents');
        return null;
      }
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${metadata.association_id}/${fileName}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      // Create record in the documents table
      const documentRecord = {
        name: file.name,
        description: metadata.description || '',
        file_size: file.size,
        file_type: file.type,
        url: publicUrlData.publicUrl,
        category: metadata.category || 'uncategorized',
        tags: metadata.tags || [],
        uploaded_by: user.id,
        association_id: metadata.association_id,
        is_public: metadata.is_public || false
      };
      
      const { data, error } = await supabase
        .from('documents')
        .insert(documentRecord)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating document record:', error);
        
        // Try to delete the uploaded file since record creation failed
        await supabase.storage
          .from('documents')
          .remove([filePath]);
          
        throw error;
      }
      
      toast.success('Document uploaded successfully');
      return data;
    } catch (error) {
      console.error('Error in uploadDocument:', error);
      toast.error('Failed to upload document');
      return null;
    }
  },
  
  /**
   * Get documents for an association
   */
  async getDocuments(associationId: string, category?: string): Promise<Document[]> {
    try {
      let query = supabase
        .from('documents')
        .select()
        .eq('association_id', associationId)
        .eq('is_archived', false);
      
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query.order('uploaded_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching documents:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getDocuments:', error);
      toast.error('Failed to load documents');
      return [];
    }
  },
  
  /**
   * Archive a document
   */
  async archiveDocument(documentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ is_archived: true })
        .eq('id', documentId);
      
      if (error) {
        console.error('Error archiving document:', error);
        throw error;
      }
      
      toast.success('Document archived');
      return true;
    } catch (error) {
      console.error('Error in archiveDocument:', error);
      toast.error('Failed to archive document');
      return false;
    }
  },
  
  /**
   * Delete a document completely
   */
  async deleteDocument(documentId: string): Promise<boolean> {
    try {
      // First get the document details to find the file path
      const { data, error: fetchError } = await supabase
        .from('documents')
        .select('url')
        .eq('id', documentId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching document for deletion:', fetchError);
        throw fetchError;
      }
      
      // Extract file path from URL
      const url = new URL(data.url);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(pathParts.indexOf('documents') + 1).join('/');
      
      // Delete from storage
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([filePath]);
        
        if (storageError) {
          console.error('Error deleting file from storage:', storageError);
          // Continue anyway to delete the record
        }
      }
      
      // Delete record from database
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);
      
      if (error) {
        console.error('Error deleting document record:', error);
        throw error;
      }
      
      toast.success('Document deleted');
      return true;
    } catch (error) {
      console.error('Error in deleteDocument:', error);
      toast.error('Failed to delete document');
      return false;
    }
  }
};
