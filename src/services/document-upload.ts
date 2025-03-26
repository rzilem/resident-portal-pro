
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
      console.log('No authenticated user found, attempting to proceed as anonymous');
      // We'll proceed as anonymous since the bucket is public
    }
    
    // Create a unique file name using uuid
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = fileName;

    console.log(`Uploading file to path: ${filePath}`);
    
    // Check if the documents bucket exists and is accessible
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('Error checking buckets:', bucketError);
      toast.error('Failed to access document storage');
      return false;
    }
    
    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket) {
      console.error('Documents bucket does not exist or is not accessible');
      
      // Try to create the bucket
      const { error: createError } = await supabase.storage.createBucket('documents', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      });
      
      if (createError) {
        console.error('Failed to create documents bucket:', createError);
        toast.error('Document storage is not available. Please contact support.');
        return false;
      }
      
      console.log('Successfully created documents bucket');
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
    
    // Ensure associationId is a valid UUID
    let validAssociationId = associationId;
    
    try {
      // Check if the input is already a valid UUID
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(associationId)) {
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
        uploaded_by: user?.id || null,
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
  } catch (error) {
    console.error('Unexpected upload error:', error);
    toast.error('An unexpected error occurred during upload');
    return false;
  }
};
