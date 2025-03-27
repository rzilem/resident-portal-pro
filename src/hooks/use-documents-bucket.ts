import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { ensureDocumentsBucketExists, testBucketAccess } from '@/utils/documents/bucketUtils';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext, useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react';

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
      const exists = await ensureDocumentsBucketExists();
      
      if (exists) {
        // Additionally check if we can actually use the bucket
        try {
          const canAccess = await testBucketAccess();
          
          if (canAccess) {
            console.log('Document storage is ready and accessible');
            setBucketReady(true);
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
  }, [retryCount, isCreating, MAX_RETRIES, user]);
  
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;
    
    // Use async/await here to properly check the session
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
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [checkBucket, user]);

  const retryCheck = async () => {
    if (isLoading || isCreating) return; // Prevent multiple concurrent retries
    
    console.log('Manually retrying bucket creation...');
    setIsCreating(true);
    
    try {
      // Force bucket creation
      const success = await ensureDocumentsBucketExists(true);
      
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
