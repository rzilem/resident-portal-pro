
import { useState, useEffect, useCallback } from 'react';
import { DocumentFile } from '@/types/documents';
import { toast } from 'sonner';
import { 
  getDocuments,
  uploadDocument as uploadDocumentService,
  deleteDocument as deleteDocumentService,
  downloadDocument as downloadDocumentService
} from '@/services/documentService';

export const useDocuments = (associationId?: string, category?: string) => {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!associationId) {
      setDocuments([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const docs = await getDocuments(associationId, category);
      setDocuments(docs);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents');
      toast.error('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  }, [associationId, category]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const uploadDocument = async (
    file: File,
    metadata: {
      description?: string;
      category?: string;
      tags?: string[];
    }
  ) => {
    if (!associationId) {
      toast.error('Association ID is required');
      return null;
    }

    try {
      const uploadedDoc = await uploadDocumentService({
        file,
        associationId,
        description: metadata.description,
        category: metadata.category || category,
        tags: metadata.tags
      });
      
      // Add to local state
      setDocuments(prevDocs => [uploadedDoc, ...prevDocs]);
      
      return uploadedDoc;
    } catch (err) {
      console.error('Error uploading document:', err);
      toast.error('Failed to upload document');
      return null;
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      await deleteDocumentService(documentId);
      
      // Remove from local state
      setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== documentId));
      
      toast.success('Document deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting document:', err);
      toast.error('Failed to delete document');
      return false;
    }
  };

  const downloadDocument = async (document: DocumentFile) => {
    try {
      await downloadDocumentService(document.url, document.name);
      return true;
    } catch (err) {
      console.error('Error downloading document:', err);
      toast.error('Failed to download document');
      return false;
    }
  };

  return {
    documents,
    isLoading,
    error,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    downloadDocument
  };
};
