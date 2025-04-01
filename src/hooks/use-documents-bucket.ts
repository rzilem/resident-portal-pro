
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDocumentsBucket = () => {
  const [bucketReady, setBucketReady] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [checking, setChecking] = useState(true);

  const checkBucket = async () => {
    setChecking(true);
    try {
      // Check if bucket exists
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Error checking buckets:', error);
        setDemoMode(true);
        setBucketReady(false);
        return;
      }
      
      const documentsBucket = buckets.find(b => b.name === 'documents');
      setBucketReady(!!documentsBucket);
      
      if (!documentsBucket) {
        // Try to create the bucket
        try {
          const { error: createError } = await supabase.storage.createBucket('documents', {
            public: true,
            fileSizeLimit: 50 * 1024 * 1024 // 50MB
          });
          
          if (createError) {
            console.error('Error creating documents bucket:', createError);
            setDemoMode(true);
          } else {
            console.log('Created documents bucket');
            setBucketReady(true);
            setDemoMode(false);
          }
        } catch (e) {
          console.error('Exception creating bucket:', e);
          setDemoMode(true);
        }
      } else {
        setDemoMode(false);
      }
    } catch (error) {
      console.error('Exception in useDocumentsBucket:', error);
      setDemoMode(true);
      setBucketReady(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkBucket();
  }, []);

  return {
    bucketReady,
    demoMode,
    checking,
    retryCheck: checkBucket
  };
};
