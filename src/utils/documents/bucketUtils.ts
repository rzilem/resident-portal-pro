
import { supabase } from '@/integrations/supabase/client';

/**
 * Ensure the documents storage bucket exists
 * @param forceCreate Force creation even if it might fail initially
 * @returns Promise<boolean> indicating if bucket exists
 */
export const ensureDocumentsBucketExists = async (forceCreate: boolean = false): Promise<boolean> => {
  try {
    // First, check if the bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError.message);
      return false;
    }
    
    const documentsBucket = buckets?.find(bucket => bucket.name === 'documents');
    
    if (documentsBucket) {
      console.log('Documents bucket already exists');
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
          error.message.includes('insufficient privileges')) {
        console.log('Storage bucket creation failed due to RLS, but this may be expected. Will proceed as if bucket exists.');
        
        // Check if we can still access the bucket despite not being able to create it
        const testResult = await testBucketAccess();
        if (testResult) {
          console.log('Document storage initialized successfully');
          return true;
        } else if (forceCreate) {
          // Try again with a direct request
          return await forceCreateBucket();
        }
        
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
 * Force create bucket with a direct attempt
 * @returns Promise<boolean> indicating if creation was successful
 */
const forceCreateBucket = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage.createBucket('documents', {
      public: true,
      fileSizeLimit: 52428800, // 50MB
    });
    
    if (error && !error.message.includes('already exists')) {
      console.error('Error in force creating bucket:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in forceCreateBucket:', error);
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
    
    // If we get an error other than "not found", there might be an access issue
    if (error && !error.message.includes('not found')) {
      console.error('Error testing bucket access:', error.message);
      return false;
    }
    
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
