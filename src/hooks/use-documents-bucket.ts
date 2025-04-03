
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Check if documents bucket exists and is accessible
const checkBucketExists = async (bucketName: string = 'documents'): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage.getBucket(bucketName);
    if (error) {
      console.error('Error checking if bucket exists:', error);
      return false;
    }
    return !!data;
  } catch (error) {
    console.error('Exception checking if bucket exists:', error);
    return false;
  }
};

// Create documents bucket if it doesn't exist
const createBucket = async (bucketName: string = 'documents'): Promise<boolean> => {
  try {
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: false,
      fileSizeLimit: 52428800, // 50MB
    });
    
    if (error) {
      console.error('Error creating bucket:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception creating bucket:', error);
    return false;
  }
};

// Test bucket access by listing files
const testBucketAccess = async (bucketName: string = 'documents'): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage.from(bucketName).list();
    if (error) {
      console.error('Error testing bucket access:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Exception testing bucket access:', error);
    return false;
  }
};

// Initialize document storage - ensures bucket exists and is accessible
export const initializeDocumentStorage = async (bucketName: string = 'documents'): Promise<{
  bucketExists: boolean;
  bucketAccessible: boolean;
}> => {
  let bucketExists = await checkBucketExists(bucketName);
  
  if (!bucketExists) {
    // Try to create the bucket
    const created = await createBucket(bucketName);
    bucketExists = created;
  }
  
  const bucketAccessible = bucketExists ? await testBucketAccess(bucketName) : false;
  
  return { bucketExists, bucketAccessible };
};

export const useDocumentsBucket = (bucketName: string = 'documents') => {
  const [bucketReady, setBucketReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkBucket = useCallback(async () => {
    setChecking(true);
    setError(null);
    
    try {
      const { bucketExists, bucketAccessible } = await initializeDocumentStorage(bucketName);
      
      if (!bucketExists) {
        setError('Document storage is not available. Please contact your administrator.');
        setBucketReady(false);
      } else if (!bucketAccessible) {
        setError('Cannot access document storage. You may not have permissions.');
        setBucketReady(false);
      } else {
        setError(null);
        setBucketReady(true);
      }
    } catch (e) {
      console.error('Unexpected error in useDocumentsBucket:', e);
      setError('An unexpected error occurred with document storage.');
      setBucketReady(false);
    } finally {
      setChecking(false);
    }
  }, [bucketName]);

  useEffect(() => {
    checkBucket();
  }, [checkBucket]);

  return {
    bucketReady,
    checking,
    error,
    retryCheck: checkBucket
  };
};
