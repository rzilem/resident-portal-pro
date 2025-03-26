
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { ensureDocumentsBucketExists, testBucketAccess } from '@/utils/documents/storageUtils';
import { supabase } from '@/integrations/supabase/client';

export const useDocumentsBucket = () => {
  const [bucketReady, setBucketReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const MAX_RETRIES = 3;

  const checkBucket = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Set a timeout for the entire check process
      const timeoutId = setTimeout(() => {
        console.log('Bucket check timed out, forcing state update');
        setIsLoading(false);
        setErrorMessage('Connection to document storage timed out');
        setBucketReady(false);
      }, 8000); // Reduced from 10s to 8s for faster feedback
      
      // Check if user is authenticated first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('User not authenticated, attempting to proceed anyway');
      }

      // First check if the bucket exists
      const exists = await ensureDocumentsBucketExists();
      
      // Clear the timeout since we got a response
      clearTimeout(timeoutId);
      
      if (exists) {
        // Additionally check if we can actually use the bucket
        const canAccess = await testBucketAccess();
        if (canAccess) {
          console.log('Document storage is ready and accessible');
          setBucketReady(true);
          toast.success("Document storage is ready");
        } else {
          console.log('Document storage exists but is not accessible');
          setErrorMessage('Document storage exists but is not accessible');
          setBucketReady(false);
          
          if (retryCount < MAX_RETRIES) {
            toast.info("Attempting to initialize document storage...");
          } else {
            toast.error("Document storage is not accessible. Please contact support.");
          }
        }
      } else {
        console.log('Documents bucket does not exist or is not accessible');
        setErrorMessage('Documents bucket does not exist or is not accessible');
        setBucketReady(false);
        
        if (!isCreating && retryCount < MAX_RETRIES) {
          toast.info("Attempting to initialize document storage...");
        } else if (retryCount >= MAX_RETRIES) {
          toast.error("Document storage is not available after multiple attempts. Please contact support.");
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
  }, [retryCount, isCreating, MAX_RETRIES]);
  
  useEffect(() => {
    let isMounted = true;
    
    const checkWithTimeout = async () => {
      // Set a hard timeout for the initial check
      const timeoutId = setTimeout(() => {
        if (isMounted && isLoading) {
          console.log('Initial bucket check timed out, forcing state update');
          setIsLoading(false);
          setErrorMessage('Connection to document storage timed out');
          setBucketReady(false);
          toast.error("Document storage connection timed out");
        }
      }, 10000); // 10s hard timeout
      
      if (isMounted) {
        await checkBucket();
      }
      
      clearTimeout(timeoutId);
    };
    
    checkWithTimeout();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [checkBucket]);

  const retryCheck = async () => {
    if (isLoading || isCreating) return; // Prevent multiple concurrent retries
    
    console.log('Manually retrying bucket creation...');
    setIsCreating(true);
    
    try {
      // Force bucket creation attempt with timeout
      const timeoutId = setTimeout(() => {
        console.log('Bucket creation timed out, forcing state update');
        setIsCreating(false);
        setErrorMessage('Bucket creation timed out');
        setBucketReady(false);
        setRetryCount(prev => prev + 1);
      }, 8000); // Reduced from 10s to 8s
      
      // Force bucket creation attempt
      const success = await ensureDocumentsBucketExists(true);
      clearTimeout(timeoutId);
      
      if (success) {
        // Also check if we can use it
        const canAccess = await testBucketAccess();
        if (canAccess) {
          setBucketReady(true);
          setErrorMessage(null);
          toast.success("Document storage initialized successfully");
        } else {
          setBucketReady(false);
          setErrorMessage('Storage initialized but cannot be accessed');
          toast.error("Document storage exists but cannot be accessed");
        }
      } else {
        setBucketReady(false);
        setErrorMessage('Failed to initialize document storage');
        toast.error("Failed to initialize document storage");
      }
    } catch (error) {
      console.error('Error during manual bucket creation retry:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error during retry');
      toast.error("Failed to initialize document storage");
      setBucketReady(false);
    } finally {
      setIsCreating(false);
      setRetryCount(prev => prev + 1);
    }
  };
  
  // Provide a function to manually check storage status
  const checkStorageStatus = () => {
    setRetryCount(0); // Reset retry count
    setErrorMessage(null);
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
