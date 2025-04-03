
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
  category?: string;
  searchQuery?: string;
  filter?: 'recent' | 'shared' | 'important';
  associationId?: string;
  refreshTrigger?: number;
}

const DocumentTable: React.FC<DocumentTableProps> = ({
  category,
  searchQuery = '',
  filter,
  associationId,
  refreshTrigger = 0
}) => {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, [category, searchQuery, filter, associationId, refreshTrigger]);

  const loadDocuments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Loading documents with filters:', { category, searchQuery, filter, associationId });
      
      let query = supabase
        .from('documents')
        .select('*');
      
      // Apply filters based on props
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
        // Last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        query = query.gte('uploaded_date', thirtyDaysAgo.toISOString());
      } else if (filter === 'shared') {
        query = query.eq('is_public', true);
      } else if (filter === 'important') {
        query = query.containedBy('tags', ['important']);
      }
      
      // Order by most recent first
      query = query.order('uploaded_date', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching documents:', error);
        setError(`Failed to load documents: ${error.message}`);
        toast.error("Failed to load documents");
        setDocuments([]);
      } else {
        console.log(`Loaded ${data.length} documents`);
        // Transform the data to match our DocumentFile interface
        const transformedData: DocumentFile[] = data.map(doc => ({
          id: doc.id,
          name: doc.name,
          description: doc.description || '',
          fileSize: doc.file_size,
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
    // This will be handled by the parent component via the onView prop
  };

  const handleDocumentDownload = (doc: DocumentFile) => {
    console.log('Downloading document:', doc.name);
    // Download logic is handled in DocumentTableRow
  };

  const handleDocumentDelete = async (doc: DocumentFile) => {
    console.log('Deleting document:', doc.name);
    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', doc.id);
      
      if (dbError) {
        throw new Error(dbError.message);
      }
      
      // Delete from storage if it's a Supabase URL
      if (doc.url && (doc.url.includes('supabase') || doc.url.includes('storage'))) {
        try {
          // Extract path from URL if possible
          const match = doc.url.match(/public\/([^/]+)\/(.+)$/);
          if (match) {
            const bucket = match[1];
            const path = match[2];
            console.log(`Deleting file from bucket: ${bucket}, path: ${path}`);
            
            const { error: storageError } = await supabase.storage
              .from(bucket)
              .remove([path]);
            
            if (storageError) {
              console.error('Error deleting file from storage:', storageError);
            }
          }
        } catch (storageErr) {
          console.error('Error deleting file from storage:', storageErr);
          // Continue anyway since the database record is deleted
        }
      }
      
      toast.success(`Document "${doc.name}" deleted successfully`);
      
      // Update documents state
      setDocuments(documents.filter(d => d.id !== doc.id));
      
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error(`Failed to delete document: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
              onDelete={handleDocumentDelete}
              refreshDocuments={loadDocuments}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentTable;
