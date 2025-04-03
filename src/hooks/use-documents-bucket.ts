
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  ensureDocumentsBucketExists, 
  testBucketAccess,
  initializeDocumentStorage
} from '@/utils/documents/bucketUtils';
import { errorLog, infoLog } from '@/utils/debug';

export const useDocumentsBucket = () => {
  const [bucketReady, setBucketReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkBucket = useCallback(async () => {
    setChecking(true);
    setError(null);
    
    try {
      infoLog('Checking document storage status...');
      
      const { bucketExists, bucketAccessible } = await initializeDocumentStorage();
      
      if (!bucketExists) {
        setError('Document storage unavailable. The system could not create or access the required storage area.');
        setBucketReady(false);
      } else if (!bucketAccessible) {
        setError('Document storage is not accessible. You may not have permission to access this resource.');
        setBucketReady(false);
      } else {
        setError(null);
        setBucketReady(true);
        infoLog('Document storage is ready to use');
      }
    } catch (e) {
      errorLog('Unexpected error in useDocumentsBucket:', e);
      setError('An unexpected error occurred checking document storage.');
      setBucketReady(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    checkBucket();
  }, [checkBucket]);

  return {
    bucketReady,
    checking,
    error,
    retryCheck: checkBucket
  };
};
