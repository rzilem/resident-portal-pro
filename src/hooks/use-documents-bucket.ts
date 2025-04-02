
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDocumentsBucket = () => {
  const [bucketReady, setBucketReady] = useState(false);
  const [checking, setChecking] = useState(true);

  const checkBucket = async () => {
    setChecking(true);
    try {
      // Check if bucket exists
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Error checking buckets:', error);
        toast.error('Error accessing document storage. Please try again later.');
        setBucketReady(false);
        setChecking(false);
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
            toast.error('Could not create documents storage. Please try again later.');
            setBucketReady(false);
          } else {
            console.log('Created documents bucket');
            setBucketReady(true);
          }
        } catch (e) {
          console.error('Exception creating bucket:', e);
          toast.error('Error setting up document storage. Please try again later.');
          setBucketReady(false);
        }
      }
    } catch (error) {
      console.error('Exception in useDocumentsBucket:', error);
      toast.error('Unexpected error accessing document storage. Please try again later.');
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
    checking,
    retryCheck: checkBucket
  };
};
