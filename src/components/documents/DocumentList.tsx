
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileIcon, EyeIcon, DownloadIcon, Trash2Icon, Star, Edit } from 'lucide-react';
import { formatFileSize, formatDate } from '@/utils/formatting';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DocumentFile } from '@/types/documents';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import DocumentPreviewDialog from './preview/DocumentPreviewDialog';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';

interface DocumentListProps {
  documents: DocumentFile[];
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  onEdit?: (document: DocumentFile) => void;
  onPreview?: (document: DocumentFile) => void;
  loading?: boolean;
  allowActions?: boolean;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onDelete,
  onToggleFavorite,
  onEdit,
  onPreview,
  loading = false,
  allowActions = true,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<DocumentFile | null>(null);
  const [previewDocument, setPreviewDocument] = useState<DocumentFile | null>(null);
  
  const handleDelete = (document: DocumentFile) => {
    setDocumentToDelete(document);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (documentToDelete && onDelete) {
      onDelete(documentToDelete.id);
    }
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };
  
  const handlePreview = (document: DocumentFile) => {
    if (onPreview) {
      onPreview(document);
    } else {
      setPreviewDocument(document);
    }
  };
  
  const handleDownload = (document: DocumentFile) => {
    if (document.url) {
      const link = document.createElement('a');
      link.href = document.url;
      link.download = document.name;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const renderCategoryBadge = (category: string) => {
    let badgeClass = 'bg-gray-200 text-gray-800';
    
    if (category === 'financial') {
      badgeClass = 'bg-emerald-100 text-emerald-800';
    } else if (category === 'legal') {
      badgeClass = 'bg-blue-100 text-blue-800';
    } else if (category === 'meeting') {
      badgeClass = 'bg-purple-100 text-purple-800';
    } else if (category === 'maintenance') {
      badgeClass = 'bg-amber-100 text-amber-800';
    }
    
    return (
      <Badge className={badgeClass}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };
  
  // Empty state
  if (!loading && documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileIcon className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No documents yet</h3>
        <p className="text-sm text-gray-500 mb-6">
          Upload documents to see them appear here.
        </p>
      </div>
    );
  }
  
  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          <Table>
            <TableCaption>List of documents</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                {allowActions && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium" onClick={() => handlePreview(doc)}>
                    <div className="flex items-center">
                      <FileIcon className="h-5 w-5 mr-2 text-blue-500" />
                      {doc.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {doc.category && renderCategoryBadge(doc.category)}
                  </TableCell>
                  <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                  <TableCell>{formatDate(doc.uploaded_date || '')}</TableCell>
                  {allowActions && (
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreview(doc)}
                          title="Preview"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(doc)}
                          title="Download"
                        >
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {onEdit && (
                              <DropdownMenuItem onClick={() => onEdit(doc)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {onToggleFavorite && (
                              <DropdownMenuItem onClick={() => onToggleFavorite(doc.id, !doc.is_favorite)}>
                                <Star className="h-4 w-4 mr-2" />
                                {doc.is_favorite ? 'Remove Favorite' : 'Add to Favorites'}
                              </DropdownMenuItem>
                            )}
                            {onDelete && (
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive" 
                                onClick={() => handleDelete(doc)}
                              >
                                <Trash2Icon className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{documentToDelete?.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={confirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          {!onPreview && (
            <DocumentPreviewDialog
              open={!!previewDocument}
              onOpenChange={() => setPreviewDocument(null)}
              document={previewDocument}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DocumentList;
