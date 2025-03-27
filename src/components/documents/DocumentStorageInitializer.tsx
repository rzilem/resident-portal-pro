
import { useEffect, useState } from 'react';
import { initializeDocumentStorage } from '@/utils/documents/initializeBucket';
import { useAuth } from '@/contexts/auth/AuthProvider';

/**
 * This is a silent initializer component that can be included
 * in the app layout to ensure document storage is properly initialized
 * when the app starts or the authentication state changes.
 */
const DocumentStorageInitializer = () => {
  const { isAuthenticated } = useAuth();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Only initialize after authentication changes
    if (!initialized || isAuthenticated) {
      const initStorage = async () => {
        try {
          await initializeDocumentStorage();
          setInitialized(true);
        } catch (error) {
          console.error('Failed to initialize document storage:', error);
        }
      };
      
      initStorage();
    }
  }, [isAuthenticated, initialized]);

  // This component doesn't render anything visible
  return null;
};

export default DocumentStorageInitializer;
