
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye, Trash, FileText, FileIcon, MoreHorizontal } from "lucide-react";
import { DocumentFile } from "@/types/documents";
import { formatFileSize, formatDate } from "@/utils/formatting";
import { DocumentPreview } from "./DocumentPreview";
import { useDocuments } from "@/hooks/use-documents";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface DocumentListProps {
  documents: DocumentFile[];
  isLoading?: boolean;
  onDelete?: (id: string) => Promise<boolean>;
  onDownload?: (document: DocumentFile) => Promise<boolean>;
  associationId?: string;
  category?: string;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  isLoading = false,
  onDelete,
  onDownload,
  associationId,
  category
}) => {
  const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(null);
  
  // If we're provided with an associationId and category, use the hook
  const {
    deleteDocument: hookDeleteDocument,
    downloadDocument: hookDownloadDocument
  } = useDocuments(associationId, category);
  
  // Use provided handlers or fallback to hook methods
  const handleDelete = async (document: DocumentFile) => {
    const deleteFunc = onDelete || hookDeleteDocument;
    
    if (!deleteFunc) {
      toast.error("Delete functionality not available");
      return;
    }
    
    const success = await deleteFunc(document.id);
    if (success) {
      toast.success(`"${document.name}" has been deleted`);
    }
  };
  
  const handleDownload = async (document: DocumentFile) => {
    const downloadFunc = onDownload || hookDownloadDocument;
    
    if (!downloadFunc) {
      toast.error("Download functionality not available");
      return;
    }
    
    const success = await downloadFunc(document);
    if (success) {
      toast.success(`Downloading "${document.name}"`);
    }
  };
  
  const handlePreview = (document: DocumentFile) => {
    setSelectedDocument(document);
  };
  
  // Function to get file icon based on MIME type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="h-4 w-4 text-red-500" />;
    if (fileType.includes('image')) return <FileIcon className="h-4 w-4 text-green-500" />;
    if (fileType.includes('word') || fileType.includes('document')) return <FileIcon className="h-4 w-4 text-blue-500" />;
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return <FileIcon className="h-4 w-4 text-green-600" />;
    return <FileIcon className="h-4 w-4 text-gray-500" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading documents...</p>
        </CardContent>
      </Card>
    );
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
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
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getFileIcon(document.fileType)}
                      <span className="font-medium truncate max-w-[300px]">
                        {document.name}
                      </span>
                    </div>
                    {document.description && (
                      <p className="text-xs text-muted-foreground mt-1 truncate max-w-[300px]">
                        {document.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {document.category || 'General'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatFileSize(document.fileSize)}</TableCell>
                  <TableCell>{formatDate(document.uploadedDate)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handlePreview(document)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(document)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(document)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedDocument && (
        <DocumentPreview 
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onDownload={handleDownload}
        />
      )}
    </>
  );
};

export default DocumentList;
