
import { useState, useEffect, useCallback } from 'react';
import { DocumentFile } from '@/types/documents';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseDocumentListProps {
  associationId?: string;
  category?: string;
  limit?: number;
}

export const useDocumentList = ({
  associationId,
  category,
  limit = 50
}: UseDocumentListProps) => {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('documents')
        .select('*')
        .eq('is_archived', false);

      if (associationId) {
        query = query.eq('association_id', associationId);
      }

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      // Add limit
      query = query.limit(limit).order('uploaded_date', { ascending: false });

      const { data, error: queryError } = await query;

      if (queryError) {
        throw queryError;
      }

      const formattedDocuments: DocumentFile[] = data.map((doc) => ({
        id: doc.id,
        name: doc.name,
        description: doc.description || '',
        fileSize: doc.file_size,
        fileType: doc.file_type,
        url: doc.url,
        category: doc.category,
        tags: doc.tags || [],
        uploadedBy: doc.uploaded_by,
        uploadedDate: doc.uploaded_date || new Date().toISOString(),
        lastModified: doc.last_modified || new Date().toISOString(),
        version: doc.version || 1,
        isPublic: doc.is_public,
        isArchived: doc.is_archived,
        expirationDate: undefined,
        previousVersions: [],
        properties: [],
        associations: [doc.association_id],
        metadata: {}
      }));

      setDocuments(formattedDocuments);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents');
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, [associationId, category, limit, refreshTrigger]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const deleteDocument = async (document: DocumentFile) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', document.id);

      if (error) throw error;

      // Also try to delete the file from storage if possible
      if (document.url) {
        try {
          const pathFromUrl = new URL(document.url).pathname;
          const filePath = pathFromUrl.replace('/storage/v1/object/public/documents/', '');
          await supabase.storage.from('documents').remove([filePath]);
        } catch (storageError) {
          console.warn('Could not delete the file from storage:', storageError);
          // Continue anyway since the database record is deleted
        }
      }

      toast.success('Document deleted successfully');
      setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== document.id));
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const refreshDocuments = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    documents: filteredDocuments,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    fetchDocuments,
    refreshDocuments,
    deleteDocument
  };
};
