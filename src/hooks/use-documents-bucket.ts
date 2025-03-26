
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ensureDocumentsBucketExists } from '@/utils/documents/storageUtils';

export const useDocumentsBucket = () => {
  const [bucketReady, setBucketReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const checkBucket = async () => {
      setIsLoading(true);
      try {
        const exists = await ensureDocumentsBucketExists();
        setBucketReady(exists);
        if (!exists && !isCreating) {
          setIsCreating(true);
          console.log('Attempting to create documents bucket...');
          
          // Retry bucket creation once
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
          }, 2000);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking bucket status:', error);
        toast.error("Failed to connect to document storage");
        setIsLoading(false);
      }
    };
    
    checkBucket();
  }, []);

  return { bucketReady, isLoading };
};
