
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { ensureDocumentsBucketExists, testBucketAccess } from '@/utils/documents/storageUtils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useDocumentsBucket = () => {
  const [bucketReady, setBucketReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const MAX_RETRIES = 3;

  const checkBucket = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    console.log('Checking bucket, user authenticated:', isAuthenticated, user?.id);
    
    try {
      if (!isAuthenticated) {
        console.log('User is not authenticated, skipping bucket check');
        setBucketReady(false);
        setIsLoading(false);
        return;
      }

      // Set a shorter timeout for the entire check process
      const timeoutPromise = new Promise<boolean>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Connection to document storage timed out'));
        }, 5000);
      });
      
      // Race the bucket check against the timeout
      const exists = await Promise.race([
        ensureDocumentsBucketExists(),
        timeoutPromise
      ]).catch(error => {
        console.log('Bucket check timed out or failed:', error.message);
        setErrorMessage('Connection to document storage timed out or failed');
        return false;
      });
      
      if (exists) {
        // Additionally check if we can actually use the bucket with shorter timeout
        try {
          const canAccess = await Promise.race([
            testBucketAccess(),
            new Promise<boolean>((_, reject) => {
              setTimeout(() => {
                reject(new Error('Bucket access test timed out'));
              }, 4000);
            })
          ]);
          
          if (canAccess) {
            console.log('Document storage is ready and accessible');
            setBucketReady(true);
            toast.success("Document storage is ready");
            setErrorMessage(null);
          } else {
            console.log('Document storage exists but is not accessible');
            setErrorMessage('Document storage exists but is not accessible');
            setBucketReady(false);
            
            if (retryCount < MAX_RETRIES) {
              toast.info("Attempting to initialize document storage...");
            } else {
              toast.error("Document storage is not accessible. Please check your permissions.");
            }
          }
        } catch (accessError) {
          console.error('Error testing bucket access:', accessError);
          setErrorMessage('Error testing bucket access: ' + (accessError instanceof Error ? accessError.message : 'Unknown error'));
          setBucketReady(false);
        }
      } else {
        console.log('Documents bucket does not exist or is not accessible');
        setErrorMessage('Documents bucket does not exist or is not accessible');
        setBucketReady(false);
        
        if (!isCreating && retryCount < MAX_RETRIES) {
          toast.info("Attempting to initialize document storage...");
        } else if (retryCount >= MAX_RETRIES) {
          toast.error("Document storage is not available. Please check your Supabase settings.");
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
  }, [retryCount, isCreating, MAX_RETRIES, isAuthenticated, user]);
  
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;
    
    const checkWithTimeout = async () => {
      try {
        await checkBucket();
      } catch (error) {
        console.error('Unhandled error in bucket check:', error);
        if (isMounted) {
          setIsLoading(false);
          setErrorMessage('Unhandled error checking bucket');
          setBucketReady(false);
        }
      }
      
      // Safety timeout to prevent infinite loading state
      timeoutId = setTimeout(() => {
        if (isMounted && isLoading) {
          console.log('Safety timeout triggered to exit loading state');
          setIsLoading(false);
          if (!bucketReady) {
            setErrorMessage('Document storage check timed out');
          }
        }
      }, 8000);
    };
    
    if (isAuthenticated) {
      checkWithTimeout();
    } else {
      setIsLoading(false);
      setBucketReady(false);
      setErrorMessage('Authentication required to use document storage');
    }
    
    // Cleanup function
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [checkBucket, isLoading, bucketReady, isAuthenticated]);

  const retryCheck = async () => {
    if (isLoading || isCreating) return; // Prevent multiple concurrent retries
    
    console.log('Manually retrying bucket creation...');
    setIsCreating(true);
    
    try {
      // Force bucket creation with timeout
      const success = await Promise.race([
        ensureDocumentsBucketExists(true),
        new Promise<boolean>((_, reject) => {
          setTimeout(() => {
            reject(new Error('Bucket creation timed out'));
          }, 7000);
        })
      ]).catch(error => {
        console.error('Bucket creation failed or timed out:', error.message);
        return false;
      });
      
      if (success) {
        // Check if we can use it
        const canAccess = await testBucketAccess();
        if (canAccess) {
          setBucketReady(true);
          setErrorMessage(null);
          toast.success("Document storage initialized successfully");
        } else {
          setBucketReady(false);
          setErrorMessage('Storage initialized but cannot be accessed');
          toast.error("Document storage exists but cannot be accessed. Please check your permissions.");
        }
      } else {
        setBucketReady(false);
        setErrorMessage('Failed to initialize document storage');
        toast.error("Failed to initialize document storage. Please check your Supabase settings.");
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
    setIsLoading(true); // Set to true to ensure the check runs
    // The checkBucket function will be called via the useEffect
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
