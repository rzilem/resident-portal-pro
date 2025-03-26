
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

  useEffect(() => {
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
        
        if (!exists && !isCreating && retryCount < MAX_RETRIES) {
          setIsCreating(true);
          setRetryCount(prev => prev + 1);
          console.log(`Attempting to create documents bucket (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
          
          // Retry bucket creation with a delay
          setTimeout(async () => {
            try {
              const retryExists = await ensureDocumentsBucketExists();
              setBucketReady(retryExists);
              if (!retryExists) {
                toast.error("Document storage is not available. Please contact support.");
              } else {
                toast.success("Document storage initialized successfully");
              }
            } catch (retryError) {
              console.error('Error retrying bucket creation:', retryError);
              toast.error("Failed to initialize document storage");
            } finally {
              setIsCreating(false);
              setIsLoading(false);
            }
          }, 1500);
        } else {
          setIsLoading(false);
          if (exists) {
            console.log('Document storage is ready to use');
          }
        }
      } catch (error) {
        console.error('Error checking bucket status:', error);
        toast.error("Failed to connect to document storage");
        setIsLoading(false);
      }
    };
    
    checkBucket();
  }, [retryCount, isCreating]);

  return { bucketReady, isLoading, retryCheck: () => setRetryCount(prev => prev + 1) };
};
