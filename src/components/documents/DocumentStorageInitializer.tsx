
import React, { useEffect, useState } from 'react';
import { ensureDocumentsBucketExists } from '@/utils/documents/ensureDocumentStorage';
import { toast } from 'sonner';

const DocumentStorageInitializer: React.FC = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initStorage = async () => {
      try {
        await ensureDocumentsBucketExists();
        setInitialized(true);
      } catch (error) {
        console.error('Failed to initialize document storage:', error);
        // Don't show error toast to avoid confusing users
        // The app should still work for most features
        setInitialized(true);
      }
    };

    initStorage();
  }, []);

  return null; // This component doesn't render anything
};

export default DocumentStorageInitializer;
