import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DocumentFile } from '@/types/documents';
import { Loader2 } from 'lucide-react';
import DocumentTableRow from './DocumentTableRow';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import NoDocumentsPlaceholder from './NoDocumentsPlaceholder';

interface DocumentTableProps {
  documents?: DocumentFile[];
  category?: string;
  searchQuery?: string;
  filter?: 'recent' | 'shared' | 'important';
  associationId?: string;
  refreshTrigger?: number;
  onViewDocument?: (document: DocumentFile) => void;
  onDeleteDocument?: (id: string) => Promise<void>;
  onDownloadDocument?: (document: DocumentFile) => Promise<boolean>;
}

const DocumentTable: React.FC<DocumentTableProps> = ({
  documents: providedDocuments,
  category,
  searchQuery = '',
  filter,
  associationId,
  refreshTrigger = 0,
  onViewDocument,
  onDeleteDocument,
  onDownloadDocument
}) => {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(providedDocuments ? false : true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (providedDocuments) {
      setDocuments(providedDocuments);
      setIsLoading(false);
      return;
    }

    loadDocuments();
  }, [providedDocuments, category, searchQuery, filter, associationId, refreshTrigger]);

  const loadDocuments = async () => {
    if (providedDocuments) {
      setDocuments(providedDocuments);
      setIsLoading(false);
      return;
    }

    if (!associationId) {
      setDocuments([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading documents with filters:', { category, searchQuery, filter, associationId });
      
      let query = supabase
        .from('documents')
        .select('*');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      
      if (associationId) {
        query = query.eq('association_id', associationId);
      }
      
      if (filter === 'recent') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        query = query.gte('uploaded_date', thirtyDaysAgo.toISOString());
      } else if (filter === 'shared') {
        query = query.eq('is_public', true);
      } else if (filter === 'important') {
        query = query.containedBy('tags', ['important']);
      }
      
      query = query.order('uploaded_date', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching documents:', error);
        setError(`Failed to load documents: ${error.message}`);
        toast.error("Failed to load documents");
        setDocuments([]);
      } else {
        console.log(`Loaded ${data.length} documents`);
        const transformedData: DocumentFile[] = data.map(doc => ({
          id: doc.id,
          name: doc.name,
          description: doc.description || '',
          fileSize: doc.file_size,
          size: doc.file_size,
          fileType: doc.file_type,
          url: doc.url,
          category: doc.category,
          tags: doc.tags || [],
          uploadedBy: doc.uploaded_by,
          uploadedDate: doc.uploaded_date,
          lastModified: doc.last_modified,
          version: doc.version,
          isPublic: doc.is_public,
          isArchived: doc.is_archived
        }));
        
        setDocuments(transformedData);
      }
    } catch (err) {
      console.error('Error in loadDocuments:', err);
      setError('An unexpected error occurred while loading documents');
      toast.error("Error loading documents");
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentView = (doc: DocumentFile) => {
    console.log('Viewing document:', doc.name);
    if (onViewDocument) {
      onViewDocument(doc);
    }
  };

  const handleDocumentDownload = async (doc: DocumentFile) => {
    console.log('Downloading document:', doc.name);
    if (onDownloadDocument) {
      return onDownloadDocument(doc);
    }
    
    try {
      const link = document.createElement('a');
      link.href = doc.url;
      link.download = doc.name;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
      return false;
    }
  };

  const handleDeleteClick = async (doc: DocumentFile) => {
    try {
      await onDeleteDocument(doc);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
        <button
          className="mt-4 text-primary hover:underline"
          onClick={loadDocuments}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <NoDocumentsPlaceholder 
        searchQuery={searchQuery} 
        category={category} 
        filter={filter}
      />
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <DocumentTableRow
              key={doc.id}
              doc={doc}
              onView={handleDocumentView}
              onDownload={handleDocumentDownload}
              onDelete={handleDeleteClick}
              refreshDocuments={loadDocuments}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentTable;
