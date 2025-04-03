
import { supabase } from '@/integrations/supabase/client';
import { DocumentFile } from '@/types/documents';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Upload document interface
interface UploadDocumentParams {
  file: File;
  associationId: string;
  description?: string;
  category?: string;
  tags?: string[];
}

// Function to upload a document to Supabase storage and record metadata
export const uploadDocument = async ({
  file,
  associationId,
  description = '',
  category = 'general',
  tags = [],
}: UploadDocumentParams): Promise<DocumentFile> => {
  // Generate a unique file path
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  const fileName = `${timestamp}-${file.name.split('.')[0]}.${fileExt}`;
  const filePath = `associations/${associationId}/${category}/${fileName}`;
  
  // Upload file to storage
  const { data: fileData, error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw new Error(`Upload failed: ${uploadError.message}`);
  }
  
  // Get public URL for the file
  const { data: urlData } = await supabase.storage
    .from('documents')
    .getPublicUrl(filePath);
  
  const publicUrl = urlData?.publicUrl || '';
  
  // Save document metadata to database
  const { data: documentData, error: dbError } = await supabase
    .from('documents')
    .insert({
      id: uuidv4(),
      name: file.name,
      description: description,
      file_size: file.size,
      file_type: file.type,
      url: publicUrl,
      category: category,
      tags: tags,
      uploaded_by: (await supabase.auth.getUser()).data.user?.id,
      association_id: associationId,
      is_public: false,
      is_archived: false,
      version: 1
    })
    .select()
    .single();
  
  if (dbError) {
    console.error('Error saving document metadata:', dbError);
    
    // If metadata save fails, try to delete the uploaded file
    await supabase.storage
      .from('documents')
      .remove([filePath]);
    
    throw new Error(`Document uploaded but metadata couldn't be saved: ${dbError.message}`);
  }
  
  // Convert to DocumentFile format
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
    lastModified: documentData.last_modified,
    version: documentData.version,
    isPublic: documentData.is_public,
    isArchived: documentData.is_archived,
    properties: [],
    associations: [associationId],
    metadata: {}
  };
};

// Function to get documents for an association
export const getDocuments = async (
  associationId: string,
  category?: string
): Promise<DocumentFile[]> => {
  let query = supabase
    .from('documents')
    .select('*')
    .eq('association_id', associationId)
    .eq('is_archived', false);
  
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
  
  // Convert to DocumentFile format
  return data.map(doc => ({
    id: doc.id,
    name: doc.name,
    description: doc.description || '',
    fileSize: doc.file_size,
    fileType: doc.file_type,
    url: doc.url,
    category: doc.category,
    tags: doc.tags || [],
    uploadedBy: doc.uploaded_by || '',
    uploadedDate: doc.uploaded_date,
    lastModified: doc.last_modified,
    version: doc.version || 1,
    isPublic: doc.is_public || false,
    isArchived: doc.is_archived || false,
    associations: [associationId],
    properties: [],
    metadata: {}
  }));
};

// Function to delete a document
export const deleteDocument = async (documentId: string): Promise<boolean> => {
  // Get document to find file path
  const { data: doc, error: getError } = await supabase
    .from('documents')
    .select('url, association_id, category')
    .eq('id', documentId)
    .single();
  
  if (getError) {
    console.error('Error getting document for deletion:', getError);
    throw getError;
  }
  
  // Extract association and path from URL
  const urlParts = doc.url.split('/');
  const fileName = urlParts[urlParts.length - 1];
  const filePath = `associations/${doc.association_id}/${doc.category}/${fileName}`;
  
  // Delete file from storage
  const { error: storageError } = await supabase.storage
    .from('documents')
    .remove([filePath]);
  
  if (storageError) {
    console.error('Error deleting file from storage:', storageError);
    // Continue to mark document as archived even if file deletion fails
  }
  
  // Delete document record (or mark as archived)
  const { error: dbError } = await supabase
    .from('documents')
    .update({ is_archived: true })
    .eq('id', documentId);
  
  if (dbError) {
    console.error('Error archiving document:', dbError);
    throw dbError;
  }
  
  return true;
};

// Function to download a document
export const downloadDocument = async (url: string, fileName: string): Promise<void> => {
  try {
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.style.display = 'none';
    
    // Add to body, click, and remove
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading document:', error);
    toast.error('Failed to download document');
    throw error;
  }
};

// Function to get document categories
export const getDocumentCategories = async (): Promise<string[]> => {
  // Default categories if we can't fetch from DB
  const defaultCategories = [
    'general',
    'financial',
    'legal',
    'meeting-minutes',
    'newsletters',
    'maintenance',
    'rules',
    'violations',
    'architectural'
  ];
  
  try {
    const { data, error } = await supabase
      .from('document_categories')
      .select('name')
      .order('sort_order', { ascending: true });
    
    if (error || !data.length) {
      console.error('Error fetching document categories:', error);
      return defaultCategories;
    }
    
    return data.map(category => category.name);
  } catch (error) {
    console.error('Exception fetching document categories:', error);
    return defaultCategories;
  }
};
