
import { useState, useEffect, useCallback } from 'react';
import { Document, documentsService } from '@/services/documentsService';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { toast } from 'sonner';

export const useDocuments = (associationId?: string, category?: string) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchDocuments = useCallback(async () => {
    if (!associationId) {
      setDocuments([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const docs = await documentsService.getDocuments(associationId, category);
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  }, [associationId, category]);

  useEffect(() => {
    if (isAuthenticated && associationId) {
      fetchDocuments();
    } else {
      setDocuments([]);
      setIsLoading(false);
    }
  }, [fetchDocuments, isAuthenticated, associationId]);

  const uploadDocument = useCallback(async (
    file: File,
    metadata: {
      description?: string;
      category?: string;
      tags?: string[];
      is_public?: boolean;
    }
  ) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to upload documents');
      return null;
    }

    if (!associationId) {
      toast.error('Association ID is required to upload documents');
      return null;
    }

    const doc = await documentsService.uploadDocument(file, {
      ...metadata,
      association_id: associationId
    });

    if (doc) {
      setDocuments(prev => [doc, ...prev]);
    }

    return doc;
  }, [associationId, isAuthenticated]);

  const archiveDocument = useCallback(async (documentId: string) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to archive documents');
      return false;
    }

    const success = await documentsService.archiveDocument(documentId);
    
    if (success) {
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    }
    
    return success;
  }, [isAuthenticated]);

  const deleteDocument = useCallback(async (documentId: string) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to delete documents');
      return false;
    }

    const success = await documentsService.deleteDocument(documentId);
    
    if (success) {
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    }
    
    return success;
  }, [isAuthenticated]);

  return {
    documents,
    isLoading,
    fetchDocuments,
    uploadDocument,
    archiveDocument,
    deleteDocument
  };
};
