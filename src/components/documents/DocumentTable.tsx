import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DocumentFile } from '@/types/documents';
import { getDocuments } from '@/utils/documents/documentDbUtils';
import { searchDocuments } from '@/utils/documents/searchUtils';
import DocumentTableRow from './DocumentTableRow';
import DocumentTableLoading from './DocumentTableLoading';
import DocumentTableEmptyState from './DocumentTableEmptyState';
import DocumentPreviewComponent from './DocumentPreviewComponent';
import { toast } from "sonner";
import { Search } from "lucide-react";

interface DocumentTableProps {
  category?: string;
  searchQuery?: string;
  filter?: string;
  associationId?: string;
  refreshTrigger?: number;
}

const DocumentTable: React.FC<DocumentTableProps> = ({ 
  category, 
  searchQuery: externalSearchQuery,
  filter,
  associationId,
  refreshTrigger = 0
}) => {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Use external search query if provided
  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setInternalSearchQuery(externalSearchQuery);
      setActiveSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);
  
  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      
      try {
        let docs: DocumentFile[] = [];
        
        // If there's a search query, use search function
        if (activeSearchQuery) {
          docs = await searchDocuments(activeSearchQuery, { 
            categories: category ? [category] : undefined
          });
        } else {
          // Otherwise use regular document fetching
          docs = await getDocuments(
            { 
              categories: category ? [category] : undefined,
              query: activeSearchQuery
            }, 
            associationId
          );
        }
        
        // Apply any additional filtering
        if (filter) {
          switch (filter) {
            case 'recent':
              docs = docs.sort((a, b) => 
                new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime()
              ).slice(0, 10);
              break;
            case 'shared':
              docs = docs.filter(doc => doc.isPublic);
              break;
            case 'important':
              docs = docs.filter(doc => doc.tags?.includes('important'));
              break;
          }
        }
        
        setDocuments(docs);
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast.error("Failed to load documents");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDocuments();
  }, [category, associationId, filter, activeSearchQuery, refreshTrigger]);
  
  const handleSearch = () => {
    setActiveSearchQuery(internalSearchQuery);
  };
  
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleDocumentView = (doc: DocumentFile) => {
    setSelectedDocument(doc);
    setShowPreview(true);
  };
  
  const handleDocumentDownload = (doc: DocumentFile) => {
    // Track download analytics if needed
    console.log('Document downloaded:', doc.name);
  };
  
  const handleDocumentDelete = async (doc: DocumentFile) => {
    try {
      // Remove the document from the local state
      setDocuments(prev => prev.filter(d => d.id !== doc.id));
      toast.success(`Document "${doc.name}" deleted successfully`);
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Only show internal search if no external query is provided */}
      {externalSearchQuery === undefined && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={internalSearchQuery}
              onChange={(e) => setInternalSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="pl-9"
            />
          </div>
          <Button variant="secondary" onClick={handleSearch}>
            Search
          </Button>
        </div>
      )}
      
      {isLoading ? (
        <DocumentTableLoading />
      ) : documents.length === 0 ? (
        <DocumentTableEmptyState 
          searchQuery={activeSearchQuery} 
          category={category} 
        />
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map(doc => (
                <DocumentTableRow 
                  key={doc.id} 
                  doc={doc} 
                  onView={handleDocumentView}
                  onDownload={handleDocumentDownload}
                  onDelete={handleDocumentDelete}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <DocumentPreviewComponent
        document={selectedDocument}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
};

export default DocumentTable;
