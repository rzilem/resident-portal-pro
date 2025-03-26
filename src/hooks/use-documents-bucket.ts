
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
      const timeoutPromise = new Promise<boolean>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Bucket check timed out after 10 seconds'));
        }, 10000);
      });
      
      // The actual check process
      const checkProcess = async () => {
        // Check if user is authenticated first
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('User not authenticated, attempting to proceed anyway');
        }

        // First check if the bucket exists
        const exists = await ensureDocumentsBucketExists();
        
        if (exists) {
          // Additionally check if we can actually use the bucket
          const canAccess = await testBucketAccess();
          if (canAccess) {
            console.log('Document storage is ready and accessible');
            setBucketReady(true);
            toast.success("Document storage is ready");
            return true;
          } else {
            console.log('Document storage exists but is not accessible');
            setErrorMessage('Document storage exists but is not accessible');
            setBucketReady(false);
            
            if (retryCount < MAX_RETRIES) {
              toast.info("Attempting to initialize document storage...");
            } else {
              toast.error("Document storage is not accessible. Please contact support.");
            }
            return false;
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
          return false;
        }
      };
      
      // Race the check against the timeout
      const result = await Promise.race([checkProcess(), timeoutPromise]);
      setIsLoading(false);
      return result;
    } catch (error) {
      console.error('Error checking bucket status:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error checking bucket status');
      toast.error("Failed to connect to document storage");
      setIsLoading(false);
      setBucketReady(false);
      return false;
    }
  }, [retryCount, isCreating, MAX_RETRIES]);
  
  useEffect(() => {
    const checkWithTimeout = async () => {
      // Set a hard timeout for the initial check
      const timeoutId = setTimeout(() => {
        if (isLoading) {
          console.log('Initial bucket check timed out, forcing state update');
          setIsLoading(false);
          setErrorMessage('Connection to document storage timed out');
          setBucketReady(false);
          toast.error("Document storage connection timed out");
        }
      }, 15000);
      
      await checkBucket();
      clearTimeout(timeoutId);
    };
    
    checkWithTimeout();
  }, [checkBucket]);

  const retryCheck = async () => {
    if (isLoading || isCreating) return; // Prevent multiple concurrent retries
    
    console.log('Manually retrying bucket creation...');
    setIsCreating(true);
    
    try {
      // Force bucket creation attempt with timeout
      const timeoutPromise = new Promise<boolean>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Bucket creation timed out after 10 seconds'));
        }, 10000);
      });
      
      const creationProcess = async () => {
        // Force bucket creation attempt
        const success = await ensureDocumentsBucketExists(true);
        
        if (success) {
          // Also check if we can use it
          const canAccess = await testBucketAccess();
          if (canAccess) {
            setBucketReady(true);
            setErrorMessage(null);
            toast.success("Document storage initialized successfully");
            return true;
          } else {
            setBucketReady(false);
            setErrorMessage('Storage initialized but cannot be accessed');
            toast.error("Document storage exists but cannot be accessed");
            return false;
          }
        } else {
          setBucketReady(false);
          setErrorMessage('Failed to initialize document storage');
          toast.error("Failed to initialize document storage");
          return false;
        }
      };
      
      // Race the creation process against the timeout
      await Promise.race([creationProcess(), timeoutPromise]);
      
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
