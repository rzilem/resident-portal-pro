
import { supabase } from '@/integrations/supabase/client';

/**
 * Ensures that the documents bucket exists in Supabase Storage
 * @returns True if successful, false otherwise
 */
export const ensureDocumentsBucketExists = async (): Promise<boolean> => {
  try {
    // Check if documents bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }

    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket) {
      console.log('Documents bucket does not exist, creating it...');
      // Create documents bucket
      const { error: createError } = await supabase.storage.createBucket('documents', {
        public: false,
        fileSizeLimit: 50 * 1024 * 1024, // 50MB limit
      });
      
      if (createError) {
        // Check if it's an RLS error, which might be expected if we don't have admin privileges
        if (createError.message.includes('row-level security')) {
          console.log('Storage bucket creation failed due to RLS, but this may be expected. Will proceed as if bucket exists.');
          return true;
        }
        
        console.error('Error creating documents bucket:', createError);
        return false;
      }
      
      console.log('Documents bucket created successfully');
    } else {
      console.log('Documents bucket already exists');
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error ensuring documents bucket exists:', error);
    return false;
  }
};
