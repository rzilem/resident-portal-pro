import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useStorageInitializer = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const checkBucketExists = async () => {
    try {
      const { data, error } = await supabase.storage.getBucket('documents');
      
      if (error) {
        if (error.message.includes('Bucket not found')) {
          return { bucketExists: false, bucketAccessible: false };
        } else {
          console.error('Error checking bucket:', error);
          return { bucketExists: false, bucketAccessible: false };
        }
      }
      
      return { bucketExists: true, bucketAccessible: true };
    } catch (err) {
      console.error('Unexpected error checking bucket:', err);
      return { bucketExists: false, bucketAccessible: false };
    }
  };
  
  const initializeStorage = async () => {
    try {
      setIsLoading(true);
      
      const bucketStatus = await checkBucketExists();
      
      if (bucketStatus && typeof bucketStatus === 'object') {
        if (bucketStatus.bucketExists && bucketStatus.bucketAccessible) {
          setIsInitialized(true);
        } else {
          setError('Bucket does not exist or is not accessible.');
          setIsInitialized(false);
        }
      }
      
    } catch (error) {
      setError('Failed to initialize storage.');
      console.error('Storage initialization error:', error);
      setIsInitialized(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    initializeStorage();
  }, []);
  
  return { isInitialized, isLoading, error };
};
