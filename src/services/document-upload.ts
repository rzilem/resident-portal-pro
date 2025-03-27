
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ensureDocumentsBucketExists, testBucketAccess } from '@/utils/documents/bucketUtils';

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
    
    // Get user ID for document ownership with direct session check
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    
    if (!user) {
      console.error('Auth error or no user found:', 'No session');
      toast.error('Authentication required to upload documents. Please sign in first.');
      return false;
    }
    
    console.log('User authenticated:', user.id);
    
    // First make sure the bucket exists
    const bucketExists = await ensureDocumentsBucketExists();
    if (!bucketExists) {
      console.error('Document storage not available');
      toast.error('Document storage is not available. Please try again later.');
      return false;
    }
    
    // Test if we can actually upload to the bucket
    const canUpload = await testBucketAccess();
    if (!canUpload) {
      console.error('Document storage not accessible for uploads');
      toast.error('Cannot upload to document storage. Please check your permissions.');
      return false;
    }
    
    // Create a unique file name using uuid
    const fileExtension = file.name.split('.').pop() || '';
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `${category}/${fileName}`;

    console.log(`Uploading file to path: ${filePath}`);
    
    // Upload file to storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Use upsert to overwrite if file exists
      });

    if (storageError) {
      console.error('Upload error:', storageError);
      toast.error(`Failed to upload document: ${storageError.message}`);
      return false;
    }

    console.log('Document uploaded successfully to storage');
    
    // Ensure associationId is a valid UUID
    let validAssociationId = associationId;
    
    try {
      // Check if the input is already a valid UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(associationId)) {
        console.log('AssociationId is not a valid UUID format:', associationId);
        
        // Try to fetch the association by ID
        const { data: association, error: associationError } = await supabase
          .from('associations')
          .select('id')
          .eq('id', associationId)
          .maybeSingle();
        
        if (associationError || !association) {
          console.log('Could not find association with ID:', associationId);
          console.log('Generating a random UUID as fallback');
          validAssociationId = uuidv4();
        } else {
          console.log('Found association with valid UUID:', association.id);
          validAssociationId = association.id;
        }
      } else {
        console.log('AssociationId is already a valid UUID:', associationId);
      }
    } catch (error) {
      console.error('Error validating association ID:', error);
      validAssociationId = uuidv4();
    }
    
    console.log(`Using association ID: ${validAssociationId}`);
    
    // Get the file URL
    const { data: urlData } = await supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    
    const fileUrl = urlData?.publicUrl || filePath;
    
    // Save document metadata to the documents table
    try {
      const { data: documentData, error: documentError } = await supabase
        .from('documents')
        .insert({
          name: file.name,
          description: description,
          file_size: file.size,
          file_type: file.type,
          url: fileUrl,
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
        
        // If there was an error saving metadata, try to delete the uploaded file
        await supabase.storage.from('documents').remove([filePath]);
        
        toast.error(`Document uploaded but metadata couldn't be saved: ${documentError.message}`);
        return false;
      }

      console.log('Document metadata saved:', documentData);
      toast.success(`Document "${file.name}" uploaded successfully`);
      return true;
    } catch (dbError) {
      console.error('Database error saving document metadata:', dbError);
      
      // Try to delete the uploaded file
      await supabase.storage.from('documents').remove([filePath]);
      
      toast.error('Error saving document information');
      return false;
    }
  } catch (error) {
    console.error('Unexpected upload error:', error);
    toast.error('An unexpected error occurred during upload');
    return false;
  }
};
