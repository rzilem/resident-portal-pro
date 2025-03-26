
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ensureDocumentsBucketExists } from '@/utils/documents/storageUtils';
import { supabase } from '@/integrations/supabase/client';

export const useDocumentsBucket = () => {
  const [bucketReady, setBucketReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const checkBucket = async () => {
    setIsLoading(true);
    try {
      // Check if user is authenticated first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('User not authenticated, attempting to proceed anyway');
        // We will still try to access the bucket as it might be public
      }

      const exists = await ensureDocumentsBucketExists();
      setBucketReady(exists);
      
      if (!exists) {
        console.log('Documents bucket does not exist or is not accessible');
        if (!isCreating && retryCount < MAX_RETRIES) {
          toast.info("Attempting to initialize document storage...");
        } else if (retryCount >= MAX_RETRIES) {
          toast.error("Document storage is not available after multiple attempts. Please contact support.");
        }
      } else {
        console.log('Document storage is ready to use');
        toast.success("Document storage is ready");
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking bucket status:', error);
      toast.error("Failed to connect to document storage");
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    checkBucket();
  }, [retryCount]);

  const retryCheck = async () => {
    if (isLoading || isCreating) return; // Prevent multiple concurrent retries
    
    console.log('Manually retrying bucket creation...');
    setIsCreating(true);
    
    try {
      // Force bucket creation attempt
      const success = await ensureDocumentsBucketExists(true);
      setBucketReady(success);
      
      if (success) {
        toast.success("Document storage initialized successfully");
      } else {
        toast.error("Failed to initialize document storage");
      }
    } catch (error) {
      console.error('Error during manual bucket creation retry:', error);
      toast.error("Failed to initialize document storage");
    } finally {
      setIsCreating(false);
      setRetryCount(prev => prev + 1);
    }
  };

  return { 
    bucketReady, 
    isLoading, 
    isCreating,
    retryCheck 
  };
};
