import React, { useState, useCallback } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow, TableCaption 
} from "@/components/ui/table";
import { DocumentFile, DocumentSearchFilters } from '@/types/documents';
import { getDocuments } from '@/utils/documents/documentUtils';
import DocumentPreview from './DocumentPreview';
import { toast } from 'sonner';
import DocumentTableFilters from './DocumentTableFilters';
import DocumentTableEmptyState from './DocumentTableEmptyState';
import DocumentTableRow from './DocumentTableRow';
import DocumentTableLoading from './DocumentTableLoading';

interface DocumentTableProps {
  category?: string;
  searchQuery?: string;
  filter?: 'recent' | 'shared' | 'important';
  associationId?: string;
  caption?: string;
  refreshTrigger?: number;
}

const DocumentTable: React.FC<DocumentTableProps> = ({ 
  category, 
  searchQuery = '',
  filter,
  associationId,
  caption,
  refreshTrigger = 0
}) => {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [sortOrder, setSortOrder] = useState<'name' | 'date' | 'size'>('date');
  const [tagFilter, setTagFilter] = useState('');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [loadKey, setLoadKey] = useState(0);
  
  React.useEffect(() => {
    loadDocuments();
  }, [category, searchQuery, localSearchQuery, filter, associationId, tagFilter, dateFilter, refreshTrigger, loadKey]);
  
  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters: DocumentSearchFilters = {
        query: searchQuery || localSearchQuery,
        categories: category ? [category] : [],
        tags: tagFilter ? [tagFilter] : []
      };
      
      if (dateFilter === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filters.dateRange = {
          start: today.toISOString(),
          end: new Date().toISOString()
        };
      } else if (dateFilter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filters.dateRange = {
          start: weekAgo.toISOString(),
          end: new Date().toISOString()
        };
      } else if (dateFilter === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filters.dateRange = {
          start: monthAgo.toISOString(),
          end: new Date().toISOString()
        };
      }
      
      if (filter === 'shared') {
        filters.isPublic = true;
      } else if (filter === 'important') {
        filters.tags = ['important'];
      }
      
      console.log('Loading documents with filters:', filters);
      const docs = await getDocuments(filters, associationId);
      console.log('Loaded documents:', docs);
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [category, searchQuery, localSearchQuery, filter, associationId, tagFilter, dateFilter]);
  
  const refreshDocuments = () => {
    setLoadKey(prevKey => prevKey + 1);
  };
  
  const handleViewDocument = (doc: DocumentFile) => {
    setSelectedDocument(doc);
    setShowPreview(true);
  };
  
  const handleDownloadDocument = (doc: DocumentFile) => {
    toast.success(`Downloading ${doc.name}`);
  };
  
  const handleDeleteDocument = (doc: DocumentFile) => {
    toast.success(`Document "${doc.name}" deleted`);
    setDocuments(documents.filter(d => d.id !== doc.id));
  };
  
  const sortedDocuments = [...documents].sort((a, b) => {
    if (sortOrder === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === 'date') {
      return new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime();
    } else if (sortOrder === 'size') {
      return b.fileSize - a.fileSize;
    }
    return 0;
  });
  
  if (isLoading) {
    return <DocumentTableLoading />;
  }

  if (sortedDocuments.length === 0) {
    return (
      <DocumentTableEmptyState
        searchQuery={searchQuery}
        localSearchQuery={localSearchQuery}
        associationId={associationId}
        refreshDocuments={refreshDocuments}
      />
    );
  }

  return (
    <div className="space-y-4">
      <DocumentTableFilters
        localSearchQuery={localSearchQuery}
        setLocalSearchQuery={setLocalSearchQuery}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        refreshDocuments={refreshDocuments}
      />

      <div className="rounded-md border">
        <Table>
          {caption && <TableCaption>{caption}</TableCaption>}
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDocuments.map(doc => (
              <DocumentTableRow
                key={doc.id}
                doc={doc}
                onView={handleViewDocument}
                onDownload={handleDownloadDocument}
                onDelete={handleDeleteDocument}
                refreshDocuments={refreshDocuments}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      
      <DocumentPreview
        document={selectedDocument}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
};

export default DocumentTable;
