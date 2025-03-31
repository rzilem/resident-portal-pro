
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { testBucketAccess, ensureDocumentsBucketExists } from '@/utils/documents/bucketUtils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

export const useDocumentsBucket = () => {
  const [bucketReady, setBucketReady] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user } = useAuth();
  const MAX_RETRIES = 3;

  const checkBucket = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // First ensure the bucket exists
      console.log('Checking document bucket exists...');
      const bucketExists = await ensureDocumentsBucketExists();
      
      if (!bucketExists) {
        console.error('Failed to ensure documents bucket exists');
        setErrorMessage('Failed to create documents storage bucket');
        setBucketReady(false);
        setDemoMode(true);
        setIsLoading(false);
        return;
      }

      // Then check if we can access the bucket
      const canAccess = await testBucketAccess();
      
      if (canAccess) {
        console.log('Document storage is ready and accessible');
        setBucketReady(true);
        setDemoMode(false);
        setErrorMessage(null);
      } else {
        console.log('Document storage is not accessible');
        setErrorMessage('Document storage is not accessible');
        setBucketReady(false);
        
        // Since we can't access the bucket, we'll treat it as a demo mode situation
        setDemoMode(true);
        if (retryCount === 0) {
          toast.info("Using demo mode for document storage");
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking bucket status:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error checking bucket status');
      toast.error("Failed to connect to document storage");
      setIsLoading(false);
      setBucketReady(false);
      setDemoMode(true);
    }
  }, [retryCount]);
  
  useEffect(() => {
    let isMounted = true;
    checkBucket();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [checkBucket]);

  const retryCheck = async () => {
    if (isLoading || isCreating) return; // Prevent multiple concurrent retries
    
    console.log('Manually retrying bucket check...');
    setRetryCount(prev => prev + 1);
    checkBucket();
  };
  
  const checkStorageStatus = () => {
    setRetryCount(0); // Reset retry count
    setErrorMessage(null);
    setIsLoading(true); // Set to true to ensure the check runs
    checkBucket();
  };

  return { 
    bucketReady, 
    demoMode,
    isLoading, 
    isCreating,
    errorMessage,
    retryCheck,
    checkStorageStatus
  };
};
