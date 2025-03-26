
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UploadDocumentParams {
  file: File;
  description: string;
  category: string;
  tags: string[];
  associationId: string;
}

export const uploadDocument = async ({ 
  file, 
  description, 
  category, 
  tags, 
  associationId 
}: UploadDocumentParams): Promise<boolean> => {
  try {
    console.log('Starting document upload process');
    
    // Get user ID for document ownership
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('User authentication required for uploading documents');
      return false;
    }
    
    // Create a unique file name using uuid
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = fileName;

    console.log(`Uploading file to path: ${filePath}`);
    
    // Upload file to storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (storageError) {
      console.error('Upload error:', storageError);
      toast.error(`Failed to upload document: ${storageError.message}`);
      return false;
    }

    console.log('Document uploaded successfully to storage:', storageData);
    
    // Save document metadata to the documents table
    const { data: documentData, error: documentError } = await supabase
      .from('documents')
      .insert({
        name: file.name,
        description: description,
        file_size: file.size,
        file_type: file.type,
        url: filePath,
        category: category,
        tags: tags.length > 0 ? tags : null,
        uploaded_by: user.id,
        association_id: associationId,
        is_public: false,
        version: 1
      })
      .select()
      .single();

    if (documentError) {
      console.error('Error saving document metadata:', documentError);
      toast.error(`Document uploaded but metadata couldn't be saved: ${documentError.message}`);
      return false;
    }

    console.log('Document metadata saved:', documentData);
    toast.success(`Document "${file.name}" uploaded successfully`);
    return true;
  } catch (error) {
    console.error('Unexpected upload error:', error);
    toast.error('An unexpected error occurred during upload');
    return false;
  }
};
