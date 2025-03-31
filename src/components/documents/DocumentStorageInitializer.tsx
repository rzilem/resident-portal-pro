
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { ensureDocumentsBucketExists } from '@/utils/documents/bucketUtils';
import { toast } from 'sonner';

const DocumentStorageInitializer: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initStorage = async () => {
      if (isAuthenticated && user && !initialized) {
        try {
          const success = await ensureDocumentsBucketExists();
          
          if (success) {
            console.log('Document storage initialized successfully');
            setInitialized(true);
          } else {
            console.error('Failed to initialize document bucket');
            toast.error('Failed to initialize document storage. Some features may not work properly.');
          }
        } catch (error) {
          console.error('Error initializing document storage:', error);
        }
      }
    };

    initStorage();
  }, [isAuthenticated, user, initialized]);

  return null; // This component doesn't render anything
};

export default DocumentStorageInitializer;
