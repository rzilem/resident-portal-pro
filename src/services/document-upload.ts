
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
    
    // Check if the documents bucket exists and is accessible
    const { data: buckets } = await supabase.storage.listBuckets();
    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket) {
      console.error('Documents bucket does not exist or is not accessible');
      toast.error('Document storage is not available. Please contact support.');
      return false;
    }
    
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
    
    // Create a valid UUID for association_id if it's not already a UUID
    let validAssociationId = associationId;
    try {
      // Test if the associationId is a valid UUID
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(associationId)) {
        console.log('Converting numeric ID to UUID');
        // If it's not a valid UUID format but a simple numeric ID, retrieve the actual UUID
        const { data: associationData, error: associationError } = await supabase
          .from('associations')
          .select('id')
          .eq('id', associationId)
          .single();
          
        if (associationError || !associationData) {
          // If we can't find the association, generate a new UUID
          console.log('Could not find association, generating new UUID');
          validAssociationId = uuidv4();
        } else {
          validAssociationId = associationData.id;
        }
      }
    } catch (error) {
      console.error('Error validating association ID:', error);
      // Fallback to generating a new UUID
      validAssociationId = uuidv4();
    }
    
    console.log(`Using association ID: ${validAssociationId}`);
    
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
        association_id: validAssociationId,
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
