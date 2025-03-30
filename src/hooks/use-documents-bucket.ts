
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { testBucketAccess } from '@/utils/documents/bucketUtils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

export const useDocumentsBucket = () => {
  const [bucketReady, setBucketReady] = useState(false);
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
      // Check user authentication
      const { data, error } = await supabase.auth.getSession();
      const isAuthValid = !!data?.session;
      
      if (!isAuthValid && !user) {
        console.log('User is not authenticated, skipping bucket check');
        setBucketReady(false);
        setIsLoading(false);
        setErrorMessage('Authentication required to use document storage');
        return;
      }

      console.log('Checking document bucket exists...');
      
      // Check if we can access the bucket
      const canAccess = await testBucketAccess();
      
      if (canAccess) {
        console.log('Document storage is ready and accessible');
        setBucketReady(true);
        setErrorMessage(null);
      } else {
        console.log('Document storage is not accessible');
        setErrorMessage('Document storage is not accessible');
        setBucketReady(false);
        
        // Since we can't create the bucket due to RLS errors,
        // we'll treat it as a demo mode situation
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
    }
  }, [retryCount, user]);
  
  useEffect(() => {
    let isMounted = true;
    
    // Check if user is authenticated before checking bucket
    const checkSessionAndBucket = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const hasSession = !!data?.session;
        
        if (user || hasSession) {
          checkBucket();
        } else {
          setIsLoading(false);
          setBucketReady(false);
          setErrorMessage('Authentication required to use document storage');
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
        setIsLoading(false);
        setBucketReady(false);
        setErrorMessage('Error checking authentication status');
      }
    };
    
    checkSessionAndBucket();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [checkBucket, user]);

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
    isLoading, 
    isCreating,
    errorMessage,
    retryCheck,
    checkStorageStatus
  };
};
