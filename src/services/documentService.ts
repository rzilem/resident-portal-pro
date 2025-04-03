
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DocumentFile } from '@/types/documents';
import { ensureDocumentsBucketExists } from '@/utils/documents';
import { v4 as uuidv4 } from 'uuid';

// Get documents from Supabase database and storage
export const getDocuments = async (
  associationId?: string,
  category?: string
): Promise<DocumentFile[]> => {
  try {
    console.log('Fetching documents for association:', associationId || 'global');
    
    let query = supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (associationId) {
      query = query.eq('association_id', associationId);
    }
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching documents:', error);
      throw new Error('Failed to fetch documents');
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    const documents: DocumentFile[] = data.map(doc => ({
      id: doc.id,
      name: doc.name,
      url: doc.url,
      fileType: doc.file_type,
      fileSize: doc.file_size,
      description: doc.description || '',
      category: doc.category || 'general',
      tags: doc.tags || [],
      uploadedDate: doc.created_at,
      lastModified: doc.updated_at,
      uploadedBy: doc.uploaded_by,
      version: doc.version || 1,
      isPublic: doc.is_public || false
    }));
    
    console.log(`Retrieved ${documents.length} documents`);
    return documents;
  } catch (error) {
    console.error('Exception fetching documents:', error);
    throw new Error('Error retrieving documents');
  }
};

// Upload document to Supabase storage and database
export const uploadDocument = async (options: {
  file: File;
  associationId?: string;
  description?: string;
  category?: string;
  tags?: string[];
}): Promise<DocumentFile | null> => {
  const { file, associationId = '00000000-0000-0000-0000-000000000000', description, category, tags } = options;
  
  try {
    console.log('Starting document upload');
    
    // Ensure bucket exists
    const bucketExists = await ensureDocumentsBucketExists();
    if (!bucketExists) {
      console.error('Document bucket does not exist and could not be created');
      toast.error('Document storage is not available');
      return null;
    }
    
    // Get current user
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    
    if (!userId) {
      console.error('No authenticated user found');
      toast.error('You must be logged in to upload documents');
      return null;
    }
    
    // Generate a unique file path
    const uniqueId = uuidv4();
    const fileExtension = file.name.split('.').pop() || '';
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9-_.]/g, '_');
    const fileName = `${uniqueId}-${sanitizedFileName}`;
    const filePath = `associations/${associationId}/${category || 'general'}/${fileName}`;
    
    console.log('Uploading file to path:', filePath);
    
    // Upload file to storage
    const { data: fileData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Error uploading document:', uploadError);
      toast.error('Failed to upload document');
      return null;
    }
    
    console.log('File uploaded successfully:', fileData?.path);
    
    // Get public URL for the file
    const { data: publicUrlData } = await supabase.storage
      .from('documents')
      .getPublicUrl(fileData.path);
    
    const fileUrl = publicUrlData?.publicUrl;
    console.log('Generated public URL:', fileUrl);
    
    if (!fileUrl) {
      console.error('Failed to generate public URL for document');
      toast.error('Failed to generate document URL');
      return null;
    }
    
    // Store document metadata in database
    const { data: docData, error: dbError } = await supabase
      .from('documents')
      .insert({
        name: file.name,
        file_path: fileData.path,
        url: fileUrl,
        file_type: file.type,
        file_size: file.size,
        description: description || '',
        category: category || 'general',
        tags: tags || [],
        uploaded_by: userId,
        association_id: associationId,
        version: 1,
        is_public: false
      })
      .select()
      .single();
    
    if (dbError) {
      console.error('Error saving document metadata:', dbError);
      
      // If database insert fails, try to clean up the uploaded file
      await supabase.storage
        .from('documents')
        .remove([fileData.path]);
      
      toast.error('Failed to save document metadata');
      return null;
    }
    
    console.log('Document metadata saved successfully:', docData);
    
    // Return the newly created document
    const newDoc: DocumentFile = {
      id: docData.id,
      name: docData.name,
      url: docData.url,
      fileType: docData.file_type,
      fileSize: docData.file_size,
      description: docData.description || '',
      category: docData.category || 'general',
      tags: docData.tags || [],
      uploadedDate: docData.created_at,
      lastModified: docData.updated_at,
      uploadedBy: docData.uploaded_by,
      version: docData.version || 1,
      isPublic: docData.is_public || false
    };
    
    return newDoc;
  } catch (error) {
    console.error('Exception uploading document:', error);
    toast.error('Failed to upload document');
    return null;
  }
};

// Delete document from Supabase storage and database
export const deleteDocument = async (documentId: string): Promise<boolean> => {
  try {
    console.log('Deleting document with ID:', documentId);
    
    // Get the document's file path
    const { data: docData, error: fetchError } = await supabase
      .from('documents')
      .select('file_path')
      .eq('id', documentId)
      .single();
    
    if (fetchError) {
      console.error('Error retrieving document details:', fetchError);
      toast.error('Failed to retrieve document details');
      return false;
    }
    
    // Delete from storage if file path exists
    if (docData.file_path) {
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([docData.file_path]);
      
      if (storageError) {
        console.error('Error deleting document from storage:', storageError);
        // Continue anyway to remove database entry
      }
    }
    
    // Delete from database
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);
    
    if (dbError) {
      console.error('Error deleting document from database:', dbError);
      toast.error('Failed to delete document metadata');
      return false;
    }
    
    console.log('Document deleted successfully');
    toast.success('Document deleted successfully');
    return true;
  } catch (error) {
    console.error('Exception deleting document:', error);
    toast.error('Failed to delete document');
    return false;
  }
};

// Download document
export const downloadDocument = async (url: string | null, fileName: string): Promise<boolean> => {
  try {
    if (!url) {
      toast.error('Document URL is not available');
      return false;
    }
    
    // Create a blob from the file URL
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Failed to fetch document:', response.statusText);
      toast.error('Failed to download document');
      return false;
    }
    
    const blob = await response.blob();
    
    // Create temporary URL and link
    const tempUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = tempUrl;
    link.download = fileName;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    window.URL.revokeObjectURL(tempUrl);
    document.body.removeChild(link);
    
    toast.success('Document downloaded successfully');
    return true;
  } catch (error) {
    console.error('Exception downloading document:', error);
    toast.error('Failed to download document');
    return false;
  }
};
