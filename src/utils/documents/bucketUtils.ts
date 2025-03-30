
import { supabase } from '@/integrations/supabase/client';

/**
 * Ensure the documents storage bucket exists
 * @param forceCreate Force creation even if it might fail initially
 * @returns Promise<boolean> indicating if bucket exists
 */
export const ensureDocumentsBucketExists = async (forceCreate: boolean = false): Promise<boolean> => {
  try {
    // First, check if the bucket already exists by testing access
    const canAccess = await testBucketAccess();
    
    if (canAccess) {
      console.log('Documents bucket exists and is accessible');
      return true;
    }
    
    // At this point, either the bucket doesn't exist or we can't access it
    // Try listing buckets to confirm
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError.message);
      return false;
    }
    
    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (documentsBucket) {
      console.log('Documents bucket exists but is not accessible due to permissions');
      // Continue as if bucket exists since we can't do anything about permissions here
      return true;
    }
    
    // Bucket doesn't exist, try to create it
    console.log('Documents bucket does not exist, creating it...');
    
    const { data, error } = await supabase.storage.createBucket('documents', {
      public: true,
      fileSizeLimit: 52428800, // 50MB in bytes
    });
    
    if (error) {
      if (error.message.includes('already exists') || 
          error.message.includes('duplicate key value') ||
          error.message.toLowerCase().includes('unique constraint')) {
        console.log('Bucket already exists despite list operation not finding it');
        return true;
      }
      
      if (error.message.includes('permission denied') || 
          error.message.includes('insufficient privileges') ||
          error.message.includes('violates row-level security policy')) {
        console.log('Storage bucket creation failed due to RLS, but this may be expected. Will proceed in demo mode.');
        
        // Check if we can still access the bucket despite not being able to create it
        const testResult = await testBucketAccess();
        if (testResult) {
          console.log('Document storage is still accessible');
          return true;
        }
        
        // In case of RLS restriction, we'll return true and handle gracefully
        // This lets the app still function in a "demo mode"
        return false;
      }
      
      console.error('Error creating documents bucket:', error.message);
      return false;
    }
    
    console.log('Documents bucket created successfully');
    return true;
  } catch (error) {
    console.error('Exception in ensureDocumentsBucketExists:', error);
    return false;
  }
};

/**
 * Test if we can access the documents bucket
 * @returns Promise<boolean> indicating if access is successful
 */
export const testBucketAccess = async (): Promise<boolean> => {
  try {
    // Try to list files in the bucket as a test
    const { data, error } = await supabase.storage
      .from('documents')
      .list('test', {
        limit: 1,
      });
    
    // If we get an error related to "not found", the bucket might still exist
    // but the path doesn't - this actually indicates successful access
    if (error) {
      if (error.message.includes('not found')) {
        // This is a good sign - bucket exists but folder doesn't
        return true;
      }
      console.error('Error testing bucket access:', error.message);
      return false;
    }
    
    // If we got here, we have access
    return true;
  } catch (error) {
    console.error('Exception in testBucketAccess:', error);
    return false;
  }
};

/**
 * Initialize document storage bucket - alias for ensureDocumentsBucketExists
 * @returns Promise<boolean> True if initialization was successful
 */
export const initializeDocumentsBucket = async (): Promise<boolean> => {
  return ensureDocumentsBucketExists();
};
