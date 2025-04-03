
import React from 'react';
import { DocumentFile } from '@/types/documents';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DownloadIcon, 
  TrashIcon, 
  FileIcon, 
  FileTextIcon, 
  FileImageIcon, 
  FileSpreadsheetIcon, 
  MoreHorizontalIcon,
  RefreshCwIcon,
  InfoIcon,
  Loader2Icon
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DocumentListProps {
  documents: DocumentFile[];
  loading: boolean;
  error: string | null;
  onDeleteDocument: (document: DocumentFile) => Promise<void>;
  onRefresh: () => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  loading,
  error,
  onDeleteDocument,
  onRefresh
}) => {
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) {
      return <FileImageIcon className="h-5 w-5 text-blue-500" />;
    } else if (fileType.includes('pdf')) {
      return <FileTextIcon className="h-5 w-5 text-red-500" />;
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('csv')) {
      return <FileSpreadsheetIcon className="h-5 w-5 text-green-500" />;
    } else {
      return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  const handleDownload = (document: DocumentFile) => {
    window.open(document.url, '_blank');
    toast.success(`Downloading ${document.name}`);
  };

  const handleDelete = async (document: DocumentFile) => {
    try {
      await onDeleteDocument(document);
      toast.success(`${document.name} has been deleted`);
    } catch (err) {
      toast.error(`Failed to delete ${document.name}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="flex flex-col items-center">
          <Loader2Icon className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-12 border rounded-md bg-destructive/10">
        <div className="flex flex-col items-center">
          <InfoIcon className="h-8 w-8 text-destructive mb-4" />
          <p className="text-destructive font-medium mb-2">Error loading documents</p>
          <p className="text-muted-foreground text-sm mb-4">{error}</p>
          <Button onClick={onRefresh} variant="outline" size="sm">
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex justify-center items-center p-12 border rounded-md border-dashed">
        <div className="flex flex-col items-center text-center">
          <FileIcon className="h-8 w-8 text-muted-foreground mb-4" />
          <h3 className="font-medium mb-1">No documents found</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Upload documents to see them listed here
          </p>
          <Button onClick={onRefresh} variant="outline" size="sm">
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {getFileIcon(doc.fileType)}
                  <span className="font-medium">{doc.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {doc.category}
                </Badge>
              </TableCell>
              <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(doc.uploadedDate), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {doc.tags && doc.tags.length > 0 ? (
                    doc.tags.slice(0, 2).map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-xs">No tags</span>
                  )}
                  {doc.tags && doc.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{doc.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(doc)}
                    className="h-8 w-8 p-0"
                    title="Download"
                  >
                    <DownloadIcon className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Document</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{doc.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(doc)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.open(doc.url, '_blank')}>
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        navigator.clipboard.writeText(doc.url);
                        toast.success('Document URL copied to clipboard');
                      }}>
                        Copy Link
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
  );
};

export default DocumentList;
