
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ensureDocumentsBucketExists } from '@/utils/documents/documentUtils';

export const useDocumentsBucket = () => {
  const [bucketReady, setBucketReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkBucket = async () => {
      setIsLoading(true);
      try {
        const exists = await ensureDocumentsBucketExists();
        setBucketReady(exists);
        if (!exists) {
          toast.error("Document storage is not available. Please contact support.");
        }
      } catch (error) {
        console.error('Error checking bucket status:', error);
        toast.error("Failed to connect to document storage");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkBucket();
  }, []);

  return { bucketReady, isLoading };
};
