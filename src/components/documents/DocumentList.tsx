
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Search, RefreshCw, Trash, Download, Eye, 
  FileText, FilePlus, FileQuestion, FileX 
} from "lucide-react";
import { formatBytes, formatDate } from "@/utils/format";
import { useDocumentList } from '@/hooks/use-document-list';
import DocumentPreview from './preview/DocumentPreview';
import { DocumentFile } from '@/types/documents';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface DocumentListProps {
  documents?: DocumentFile[];
  loading?: boolean;
  error?: string | null;
  onDeleteDocument?: (document: DocumentFile) => void;
  onRefresh?: () => void;
  associationId?: string;
  category?: string;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents: providedDocuments,
  loading: providedLoading,
  error: providedError,
  onDeleteDocument: providedDeleteFn,
  onRefresh: providedRefreshFn,
  associationId,
  category
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDocument, setPreviewDocument] = useState<DocumentFile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Use the hook only if associationId is provided and no documents are provided
  const hookProps = associationId ? { associationId, category } : {};
  const { 
    documents: hookDocuments, 
    loading: hookLoading, 
    error: hookError, 
    searchQuery: hookSearchQuery, 
    setSearchQuery: hookSetSearchQuery,
    deleteDocument: hookDeleteDocument,
    refreshDocuments: hookRefreshDocuments
  } = useDocumentList(hookProps);

  // Use provided props if available, otherwise use hook values
  const documents = providedDocuments || hookDocuments;
  const loading = providedLoading !== undefined ? providedLoading : hookLoading;
  const error = providedError !== undefined ? providedError : hookError;
  const deleteDocument = providedDeleteFn || hookDeleteDocument;
  const refreshDocuments = providedRefreshFn || hookRefreshDocuments;

  // Sync search query with hook if using hook
  useEffect(() => {
    if (!providedDocuments && associationId) {
      hookSetSearchQuery(searchQuery);
    }
  }, [searchQuery, providedDocuments, associationId, hookSetSearchQuery]);

  const filteredDocuments = documents.filter(doc => 
    !searchQuery ? true : (
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleDelete = async (document: DocumentFile) => {
    if (window.confirm(`Are you sure you want to delete "${document.name}"?`)) {
      try {
        await deleteDocument(document);
        toast.success("Document deleted successfully");
      } catch (error) {
        console.error("Error deleting document:", error);
        toast.error("Failed to delete document");
      }
    }
  };

  const handlePreview = (document: DocumentFile) => {
    setPreviewDocument(document);
    setIsPreviewOpen(true);
  };

  const handleDownload = (document: DocumentFile) => {
    if (!document.url) {
      toast.error("Document URL is not available");
      return;
    }

    const link = document.createElement('a');
    link.href = document.url;
    link.download = document.name;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <FileX className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Error Loading Documents</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refreshDocuments} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center">
            <RefreshCw className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading documents...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredDocuments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Documents Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "No documents match your search criteria." : "No documents have been uploaded yet."}
            </p>
            <div className="flex justify-center gap-4">
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery('')} className="gap-2">
                  <Search className="h-4 w-4" />
                  Clear Search
                </Button>
              )}
              <Button onClick={refreshDocuments} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={refreshDocuments} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Name</TableHead>
              <TableHead className="w-[15%]">Category</TableHead>
              <TableHead className="w-[15%]">Size</TableHead>
              <TableHead className="w-[15%]">Date</TableHead>
              <TableHead className="text-right w-[15%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((document) => (
              <TableRow key={document.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{document.name}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {document.category}
                  </Badge>
                </TableCell>
                <TableCell>{formatBytes(document.fileSize)}</TableCell>
                <TableCell>{formatDate(document.uploadedDate)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={() => handlePreview(document)} size="icon" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Preview</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={() => handleDownload(document)} size="icon" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Download</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={() => handleDelete(document)} size="icon" variant="ghost">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <DocumentPreview
        document={previewDocument}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />
    </div>
  );
};

export default DocumentList;
