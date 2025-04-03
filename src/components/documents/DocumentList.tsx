
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileIcon, FileTextIcon, FilePdfIcon, FileImageIcon, MoreHorizontalIcon, Download, Eye, Trash2, PencilIcon } from 'lucide-react';
import { formatBytes, formatDate } from '@/utils/format';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DocumentFile } from '@/types/documents';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DocumentPreview from './preview/DocumentPreview';
import DeleteDocumentDialog from './DeleteDocumentDialog';
import { useDocuments } from '@/hooks/use-documents';

interface DocumentListProps {
  documents?: DocumentFile[];
  isLoading?: boolean;
  error?: string | null;
  onDelete?: (document: DocumentFile) => void;
  onPreview?: (document: DocumentFile) => void;
  onDownload?: (document: DocumentFile) => void;
  onEdit?: (document: DocumentFile) => void;
  associationId?: string;
  category?: string;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents = [],
  isLoading = false,
  error = null,
  onDelete,
  onPreview,
  onDownload,
  onEdit,
  associationId,
  category
}) => {
  const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // If associationId or category is provided, we'll fetch documents
  const { 
    documents: fetchedDocuments, 
    loading: fetchLoading, 
    error: fetchError,
    deleteDocument
  } = useDocuments(associationId, category);
  
  // Use provided documents or fetched documents
  const displayDocuments = documents.length > 0 ? documents : fetchedDocuments;
  const displayLoading = isLoading || fetchLoading;
  const displayError = error || fetchError;

  const handlePreview = (document: DocumentFile) => {
    setSelectedDocument(document);
    setPreviewOpen(true);
    if (onPreview) onPreview(document);
  };

  const handleDelete = (document: DocumentFile) => {
    setSelectedDocument(document);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDocument) return;
    
    if (onDelete) {
      onDelete(selectedDocument);
    } else if (deleteDocument && selectedDocument.id) {
      await deleteDocument(selectedDocument.id);
    }
    
    setDeleteDialogOpen(false);
    setSelectedDocument(null);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FilePdfIcon className="h-4 w-4 text-red-500" />;
    if (fileType.includes('image')) return <FileImageIcon className="h-4 w-4 text-blue-500" />;
    if (fileType.includes('text') || fileType.includes('document')) return <FileTextIcon className="h-4 w-4 text-amber-500" />;
    return <FileIcon className="h-4 w-4 text-gray-500" />;
  };

  if (displayLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center p-6">
          <div className="flex flex-col items-center space-y-2">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Loading documents...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (displayError) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-2">Error loading documents</div>
          <p className="text-sm text-muted-foreground">{displayError}</p>
        </CardContent>
      </Card>
    );
  }

  if (displayDocuments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <FileIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Documents Found</h3>
          <p className="text-muted-foreground mb-4">
            There are no documents in this category yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayDocuments.map((document) => (
              <TableRow key={document.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(document.fileType)}
                    <span>{document.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {document.category}
                  </Badge>
                </TableCell>
                <TableCell>{formatBytes(document.fileSize)}</TableCell>
                <TableCell>{formatDate(document.uploadedDate)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePreview(document)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {onDownload && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDownload(document)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePreview(document)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(document)}>
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        
                        {(onDownload || document.url) && (
                          <DropdownMenuItem 
                            onClick={() => onDownload ? onDownload(document) : window.open(document.url, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(document)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedDocument && (
        <>
          <DocumentPreview
            document={selectedDocument}
            open={previewOpen}
            onOpenChange={setPreviewOpen}
          />
          
          <DeleteDocumentDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={confirmDelete}
            documentName={selectedDocument.name}
          />
        </>
      )}
    </>
  );
};

export default DocumentList;
