
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { testBucketAccess, ensureDocumentsBucketExists } from '@/utils/documents/bucketUtils';
import { errorLog, infoLog } from '@/utils/debug';

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
    infoLog('Starting document upload process');
    
    // First ensure the documents bucket exists
    const bucketExists = await ensureDocumentsBucketExists();
    if (!bucketExists) {
      errorLog('Document storage bucket does not exist and could not be created');
      toast.error('Failed to access document storage');
      return false;
    }
    
    // Get user ID for document ownership with direct session check
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    
    if (!user) {
      errorLog('Auth error or no user found:', 'No session');
      toast.error('Authentication required to upload documents. Please sign in first.');
      return false;
    }
    
    infoLog('User authenticated:', user.id);
    
    // Create a unique file name using uuid
    const fileExtension = file.name.split('.').pop() || '';
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Create path with category and add date-based organization
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    
    // Create a more organized path structure
    const filePath = `${associationId}/${category}/${year}/${month}/${fileName}`;

    infoLog(`Uploading file to path: ${filePath}`);
    
    // Upload file to storage with proper error handling
    try {
      const { data: storageData, error: storageError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true // Use upsert to overwrite if file exists
        });

      if (storageError) {
        errorLog('Upload error:', storageError);
        
        // Special handling for specific errors
        if (storageError.message.includes('storage.objects') || 
            storageError.message.includes('row-level security policy')) {
          toast.error('You may not have permission to upload documents. Please contact an administrator.');
          return false;
        }
        
        toast.error(`Failed to upload document: ${storageError.message}`);
        return false;
      }

      if (!storageData) {
        errorLog('No storage data returned but no error');
        toast.error('Document upload failed for unknown reason');
        return false;
      }

      infoLog('Document uploaded successfully to storage', storageData.path);
      
      // Get the file URL
      const { data: urlData } = await supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      const fileUrl = urlData?.publicUrl || '';
      infoLog('Generated public URL:', fileUrl);
      
      // Store minimal metadata to ensure success even if full DB entry fails
      try {
        const { data: documentData, error: documentError } = await supabase
          .from('documents')
          .insert({
            name: file.name,
            description: description,
            file_size: file.size,
            file_type: file.type || `application/${fileExtension}`,
            url: fileUrl,
            category: category,
            tags: tags.length > 0 ? tags : null,
            uploaded_by: user.id,
            association_id: associationId,
            is_public: false,
            version: 1,
            last_modified: new Date().toISOString(),
            uploaded_date: new Date().toISOString()
          })
          .select()
          .single();

        if (documentError) {
          errorLog('Error saving document metadata:', documentError);
          
          // Continue anyway since the file was uploaded successfully
          // We just won't have it in the database, but it's better than nothing
          toast.success(`Document "${file.name}" uploaded successfully (metadata incomplete)`);
          return true;
        }

        infoLog('Document metadata saved:', documentData);
        toast.success(`Document "${file.name}" uploaded successfully`);
        return true;
      } catch (dbError) {
        errorLog('Database error saving document metadata:', dbError);
        
        // Continue anyway - the file is uploaded even if we couldn't save metadata
        toast.success(`Document "${file.name}" uploaded successfully (metadata incomplete)`);
        return true;
      }
    } catch (uploadError) {
      errorLog('Upload process error:', uploadError);
      toast.error('Failed to upload document. Please try again.');
      return false;
    }
  } catch (error) {
    errorLog('Unexpected upload error:', error);
    toast.error('An unexpected error occurred during upload');
    return false;
  }
};
