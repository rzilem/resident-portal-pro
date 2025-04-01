
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { validateFileSize, validateFileType } from './fileUtils';
import { v4 as uuidv4 } from 'uuid';
import { ensureDocumentsBucketExists, testBucketAccess } from './bucketUtils';

interface UploadDocumentOptions {
  file: File;
  category?: string;
  description?: string;
  tags?: string[];
  associationId?: string;
  path?: string;
  isPublic?: boolean;
}

export const uploadDocument = async ({
  file,
  category = 'general',
  description = '',
  tags = [],
  associationId = '00000000-0000-0000-0000-000000000000', // Default system-wide association ID
  path,
  isPublic = false
}: UploadDocumentOptions): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    console.log('Starting document upload process');
    
    // Validate the file
    try {
      validateFileSize(file, 50); // 50MB limit
      validateFileType(file, [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/zip',
        'application/x-zip-compressed',
        'image/*',
        '*/*' // Allow all files for now
      ]);
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Invalid file' 
      };
    }
    
    // Check if documents bucket exists
    const bucketExists = await ensureDocumentsBucketExists();
    if (!bucketExists) {
      return {
        success: false,
        error: 'Document storage is not available. Please check your Supabase configuration.'
      };
    }
    
    // Test bucket access
    const canAccess = await testBucketAccess();
    if (!canAccess) {
      return {
        success: false,
        error: 'Cannot access document storage. Please check your permissions.'
      };
    }
    
    // Get user ID 
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    
    if (!user) {
      return {
        success: false,
        error: 'Authentication required to upload documents. Please sign in first.'
      };
    }
    
    // Generate unique file path
    const fileExtension = file.name.split('.').pop() || '';
    const uniqueId = uuidv4();
    const fileName = `${uniqueId}.${fileExtension}`;
    
    // Determine file path
    let uploadPath: string;
    if (path) {
      uploadPath = `${path}/${fileName}`;
    } else if (associationId) {
      uploadPath = `associations/${associationId}/${category}/${fileName}`;
    } else {
      uploadPath = `users/${user.id}/${category}/${fileName}`;
    }
    
    console.log(`Uploading file to: ${uploadPath}`);
    
    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(uploadPath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return {
        success: false,
        error: `Upload failed: ${uploadError.message}`
      };
    }
    
    // Get the file URL
    const { data: urlData } = await supabase.storage
      .from('documents')
      .getPublicUrl(uploadData.path);
    
    const publicUrl = urlData?.publicUrl || '';
    console.log('Generated public URL:', publicUrl);
    
    // Save document metadata to the documents table
    try {
      const { error: metadataError } = await supabase
        .from('documents')
        .insert({
          name: file.name,
          description: description,
          file_size: file.size,
          file_type: file.type,
          url: publicUrl,
          category: category,
          tags: tags.length > 0 ? tags : null,
          uploaded_by: user.id,
          association_id: associationId,
          is_public: isPublic,
          version: 1
        });
      
      if (metadataError) {
        console.error('Error saving document metadata:', metadataError);
        
        // If metadata save fails, try to delete the uploaded file
        await supabase.storage.from('documents').remove([uploadPath]);
        
        return {
          success: false,
          error: `Document uploaded but metadata couldn't be saved: ${metadataError.message}`
        };
      }
    } catch (metaError) {
      console.error('Exception in metadata saving:', metaError);
      // Continue anyway since the file was uploaded successfully
    }
    
    console.log('Document upload completed successfully');
    return {
      success: true,
      url: publicUrl
    };
  } catch (error) {
    console.error('Unexpected upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred during upload'
    };
  }
};
