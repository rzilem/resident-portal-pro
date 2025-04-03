
import React, { useState } from 'react';
import { 
  MoreHorizontal, 
  Download, 
  Trash2, 
  FileText, 
  Eye, 
  Calendar, 
  Tag
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { DocumentFile } from '@/types/documents';
import { formatFileSize, formatDate, getFileTypeInfo } from '@/utils/documents';
import DocumentPreview from './preview/DocumentPreview';
import { Skeleton } from '@/components/ui/skeleton';

interface DocumentListProps {
  documents: DocumentFile[];
  loading: boolean;
  error: string | null;
  onDeleteDocument: (id: string) => Promise<boolean>;
  onDownloadDocument?: (document: DocumentFile) => Promise<boolean>;
  onRefresh: () => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  loading,
  error,
  onDeleteDocument,
  onDownloadDocument,
  onRefresh
}) => {
  const [previewDocument, setPreviewDocument] = useState<DocumentFile | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  
  const handleOpenPreview = (document: DocumentFile) => {
    setPreviewDocument(document);
  };
  
  const handleClosePreview = () => {
    setPreviewDocument(null);
  };
  
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDeleteLoading(id);
      try {
        await onDeleteDocument(id);
      } finally {
        setDeleteLoading(null);
      }
    }
  };
  
  const handleDownload = async (document: DocumentFile) => {
    if (onDownloadDocument) {
      return onDownloadDocument(document);
    }
    
    // Fallback to direct download if no download handler provided
    try {
      if (!document.url) {
        console.error('No URL available for download');
        return false;
      }
      
      const link = document.createElement('a');
      link.href = document.url;
      link.target = '_blank';
      link.download = document.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch (error) {
      console.error('Error downloading document:', error);
      return false;
    }
  };
  
  // Display loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-4 py-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="ml-auto">
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Display error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          <Button
            variant="link"
            className="p-0 h-auto font-normal ml-2"
            onClick={onRefresh}
          >
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  // Display empty state
  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium mb-2">No documents found</h3>
        <p className="text-muted-foreground mb-4">
          Upload documents using the "Upload Document" button
        </p>
        <Button
          variant="outline"
          onClick={onRefresh}
          className="gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => {
              const fileInfo = getFileTypeInfo(document.fileType || '', document.name);
              
              return (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2 max-w-md overflow-hidden">
                      <FileText className={`h-5 w-5 flex-shrink-0 ${fileInfo.color}`} />
                      <span className="truncate">{document.name}</span>
                    </div>
                    
                    {document.description && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {document.description}
                      </p>
                    )}
                    
                    {document.tags && document.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {document.tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs py-0 px-1">
                            {tag}
                          </Badge>
                        ))}
                        {document.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs py-0 px-1">
                            +{document.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {document.category || 'general'}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {formatDate(document.uploadedDate)}
                    </div>
                  </TableCell>
                  
                  <TableCell>{formatFileSize(document.fileSize)}</TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleOpenPreview(document)}
                      >
                        <span className="sr-only">Preview</span>
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDownload(document)}
                      >
                        <span className="sr-only">Download</span>
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={deleteLoading === document.id}
                          >
                            <span className="sr-only">Actions</span>
                            {deleteLoading === document.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleOpenPreview(document)}
                            className="gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Preview</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDownload(document)}
                            className="gap-2"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(document.id)}
                            className="text-destructive gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      <DocumentPreview 
        document={previewDocument} 
        open={previewDocument !== null}
        onOpenChange={handleClosePreview}
      />
    </>
  );
};

export default DocumentList;
