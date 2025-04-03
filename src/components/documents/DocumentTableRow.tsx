
import React, { useState } from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { DocumentFile } from '@/types/documents';
import { formatFileSize, formatDate } from '@/utils/documents/documentUtils';
import { Button } from '@/components/ui/button';
import { Eye, Download, Trash2, MoreHorizontal, Share, EditIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import FileIcon from './preview/FileIcon';

interface DocumentTableRowProps {
  doc: DocumentFile;
  onView?: (doc: DocumentFile) => void;
  onDownload?: (doc: DocumentFile) => Promise<boolean>;
  onDelete?: (doc: DocumentFile) => Promise<void>;
  onEdit?: (doc: DocumentFile) => void;
  refreshDocuments?: () => void;
}

const DocumentTableRow: React.FC<DocumentTableRowProps> = ({
  doc,
  onView,
  onDownload,
  onDelete,
  onEdit,
  refreshDocuments
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleView = () => {
    if (onView) {
      onView(doc);
    }
  };
  
  const handleDownload = async () => {
    if (onDownload) {
      await onDownload(doc);
    }
  };
  
  const confirmDelete = () => {
    setDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(doc);
      if (refreshDocuments) {
        refreshDocuments();
      }
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };
  
  const handleEdit = () => {
    if (onEdit) {
      onEdit(doc);
    }
  };
  
  return (
    <>
      <TableRow>
        <TableCell>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <FileIcon fileType={doc.fileType} size={24} />
            </div>
            <div className="overflow-hidden">
              <p className="font-medium truncate max-w-[200px]">{doc.name}</p>
              {doc.description && (
                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {doc.description}
                </p>
              )}
            </div>
          </div>
        </TableCell>
        
        <TableCell className="text-muted-foreground text-sm">
          {formatDate(doc.uploadedDate)}
        </TableCell>
        
        <TableCell className="text-muted-foreground text-sm">
          {formatFileSize(doc.fileSize)}
        </TableCell>
        
        <TableCell className="text-muted-foreground text-sm">
          {doc.uploadedBy ? doc.uploadedBy : 'System'}
        </TableCell>
        
        <TableCell>
          <div className="flex flex-wrap gap-1">
            {doc.tags?.slice(0, 2).map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {doc.tags && doc.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{doc.tags.length - 2}
              </Badge>
            )}
          </div>
        </TableCell>
        
        <TableCell className="text-right">
          <div className="flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleView}
              className="h-8 w-8"
              aria-label="View document"
            >
              <Eye className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              className="h-8 w-8"
              aria-label="Download document"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={handleEdit}>
                    <EditIcon className="h-4 w-4 mr-2" />
                    Edit Details
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={confirmDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{doc.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DocumentTableRow;
