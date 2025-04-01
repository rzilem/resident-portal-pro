
import { useState, useEffect } from 'react';
import { testBucketAccess, ensureDocumentsBucketExists } from '@/utils/documents/bucketUtils';
import { toast } from 'sonner';
import { useAuth } from './use-auth';

export const useDocumentsBucket = () => {
  const [bucketReady, setBucketReady] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  const checkBucketAccess = async () => {
    setIsChecking(true);
    try {
      console.log('Checking document bucket access...');
      
      // Skip check if not authenticated
      if (!isAuthenticated) {
        console.log('User not authenticated, skipping bucket check');
        setBucketReady(false);
        setDemoMode(true);
        return;
      }
      
      // First ensure the bucket exists
      const bucketExists = await ensureDocumentsBucketExists();
      
      if (!bucketExists) {
        console.log('Document bucket does not exist or could not be created');
        setBucketReady(false);
        setDemoMode(true);
        return;
      }
      
      // Then test if we can access it
      const canAccess = await testBucketAccess();
      
      setBucketReady(canAccess);
      setDemoMode(!canAccess);
      
      console.log(`Document bucket is ${canAccess ? 'accessible' : 'not accessible'}, using ${!canAccess ? 'demo mode' : 'normal mode'}`);
    } catch (error) {
      console.error('Error checking document bucket access:', error);
      setBucketReady(false);
      setDemoMode(true);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkBucketAccess();
  }, [isAuthenticated]);

  const retryCheck = async () => {
    toast.info('Checking document storage access...');
    await checkBucketAccess();
    
    if (bucketReady) {
      toast.success('Document storage is now accessible');
    } else {
      toast.error('Document storage is still unavailable');
    }
  };

  return {
    bucketReady,
    isChecking,
    demoMode,
    retryCheck
  };
};
