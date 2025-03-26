
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { ensureDocumentsBucketExists, testBucketAccess } from '@/utils/documents/storageUtils';
import { supabase } from '@/integrations/supabase/client';

export const useDocumentsBucket = () => {
  const [bucketReady, setBucketReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const checkBucket = useCallback(async () => {
    setIsLoading(true);
    try {
      // Check if user is authenticated first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('User not authenticated, attempting to proceed anyway');
        // We will still try to access the bucket as it might be public
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
        } else {
          console.log('Document storage exists but is not accessible');
          setBucketReady(false);
          
          if (retryCount < MAX_RETRIES) {
            toast.info("Attempting to initialize document storage...");
          } else {
            toast.error("Document storage is not accessible. Please contact support.");
          }
        }
      } else {
        console.log('Documents bucket does not exist or is not accessible');
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
      toast.error("Failed to connect to document storage");
      setIsLoading(false);
      setBucketReady(false);
    }
  }, [retryCount, isCreating]);
  
  useEffect(() => {
    checkBucket();
  }, [checkBucket]);

  const retryCheck = async () => {
    if (isLoading || isCreating) return; // Prevent multiple concurrent retries
    
    console.log('Manually retrying bucket creation...');
    setIsCreating(true);
    
    try {
      // Force bucket creation attempt
      const success = await ensureDocumentsBucketExists(true);
      
      if (success) {
        // Also check if we can use it
        const canAccess = await testBucketAccess();
        if (canAccess) {
          setBucketReady(true);
          toast.success("Document storage initialized successfully");
        } else {
          setBucketReady(false);
          toast.error("Document storage exists but cannot be accessed");
        }
      } else {
        setBucketReady(false);
        toast.error("Failed to initialize document storage");
      }
    } catch (error) {
      console.error('Error during manual bucket creation retry:', error);
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
    checkBucket();
  };

  return { 
    bucketReady, 
    isLoading, 
    isCreating,
    retryCheck,
    checkStorageStatus
  };
};
