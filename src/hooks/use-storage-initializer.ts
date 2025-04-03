
import { useEffect, useState } from 'react';
import { initializeDocumentStorage } from '@/utils/documents/bucketUtils';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { infoLog, errorLog } from '@/utils/debug';

/**
 * Hook to initialize storage buckets when the application loads
 * Should be used in a high-level component like _app or layout
 */
export const useStorageInitializer = () => {
  const [initialized, setInitialized] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const initStorage = async () => {
      if (isAuthenticated && !initialized && !initializing) {
        setInitializing(true);
        setError(null);
        
        try {
          infoLog('Initializing storage buckets...');
          const { bucketExists, bucketAccessible } = await initializeDocumentStorage();
          
          if (!bucketExists) {
            setError('Failed to initialize document storage: bucket could not be created');
            infoLog('Document bucket could not be created');
          } else if (!bucketAccessible) {
            setError('Document storage is not accessible');
            infoLog('Document bucket is not accessible');
          } else {
            setInitialized(true);
            infoLog('Document storage initialized successfully');
          }
        } catch (e) {
          const errorMessage = e instanceof Error ? e.message : 'Unknown error';
          errorLog('Error initializing storage:', e);
          setError(`Error initializing storage: ${errorMessage}`);
        } finally {
          setInitializing(false);
        }
      }
    };

    initStorage();
  }, [isAuthenticated, initialized, initializing]);

  return {
    initialized,
    initializing,
    error
  };
};
