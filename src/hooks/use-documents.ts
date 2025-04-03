
import { useState, useEffect, useCallback } from 'react';
import { DocumentFile } from '@/types/documents';
import { toast } from 'sonner';
import { 
  getDocuments,
  uploadDocument as uploadDocumentService,
  deleteDocument as deleteDocumentService,
  downloadDocument as downloadDocumentService
} from '@/services/documentService';
import { filterDocumentsBySearch, filterDocumentsByCategory } from '@/utils/documents';

export const useDocuments = (associationId?: string, initialCategory?: string) => {
  const [allDocuments, setAllDocuments] = useState<DocumentFile[]>([]);
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const fetchDocuments = useCallback(async () => {
    if (!associationId) {
      setAllDocuments([]);
      setDocuments([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const docs = await getDocuments(associationId, selectedCategory);
      setAllDocuments(docs);
      
      // Apply any existing search filter
      if (searchQuery) {
        setDocuments(filterDocumentsBySearch(docs, searchQuery));
      } else {
        setDocuments(docs);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents');
      toast.error('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  }, [associationId, selectedCategory, searchQuery]);

  // Fetch documents on mount and when dependencies change
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Handle search and category filter changes
  useEffect(() => {
    if (searchQuery) {
      setDocuments(filterDocumentsBySearch(allDocuments, searchQuery));
    } else {
      setDocuments(allDocuments);
    }
  }, [searchQuery, allDocuments]);

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
      setError(null);
      
      const uploadedDoc = await uploadDocumentService({
        file,
        associationId,
        description: metadata.description,
        category: metadata.category || selectedCategory || 'general',
        tags: metadata.tags
      });
      
      if (uploadedDoc) {
        // Add to local state if it matches current filters
        if (!selectedCategory || selectedCategory === 'all' || uploadedDoc.category === selectedCategory) {
          setAllDocuments(prevDocs => [uploadedDoc, ...prevDocs]);
          
          // Apply search filter to updated documents
          if (searchQuery) {
            setDocuments(filterDocumentsBySearch([uploadedDoc, ...allDocuments], searchQuery));
          } else {
            setDocuments(prevDocs => [uploadedDoc, ...prevDocs]);
          }
        }
        
        toast.success(`${file.name} uploaded successfully`);
      }
      
      return uploadedDoc;
    } catch (err) {
      console.error('Error uploading document:', err);
      toast.error('Failed to upload document');
      return null;
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const success = await deleteDocumentService(documentId);
      
      if (success) {
        // Remove from local state
        const updatedDocs = allDocuments.filter(doc => doc.id !== documentId);
        setAllDocuments(updatedDocs);
        
        // Apply search filter to updated documents
        if (searchQuery) {
          setDocuments(filterDocumentsBySearch(updatedDocs, searchQuery));
        } else {
          setDocuments(updatedDocs);
        }
        
        toast.success('Document deleted successfully');
      }
      
      return success;
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
  
  const setCategory = (category?: string) => {
    setSelectedCategory(category);
  };

  return {
    documents,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setCategory,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    downloadDocument
  };
};
