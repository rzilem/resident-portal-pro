
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDocuments } from '@/hooks/use-documents';
import { toast } from 'sonner';
import { Search, Plus, Download, Eye, Trash } from 'lucide-react';
import DocumentUploadDialog from './DocumentUploadDialog';
import DocumentPreview from './DocumentPreview';
import { formatBytes } from '@/utils/documents/fileUtils';
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
import { useAuth } from '@/hooks/use-auth';

interface DocumentListProps {
  associationId?: string;
  category?: string;
}

const DocumentList: React.FC<DocumentListProps> = ({ associationId, category }) => {
  const { isAuthenticated } = useAuth();
  const { 
    documents, 
    isLoading, 
    fetchDocuments, 
    deleteDocument 
  } = useDocuments(associationId, category);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  const refreshDocuments = () => {
    fetchDocuments();
  };

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleOpenPreview = (document: any) => {
    setSelectedDocument(document);
    setPreviewOpen(true);
  };

  const handleDownload = (document: any) => {
    if (document.url) {
      window.open(document.url, '_blank');
    } else {
      toast.error('Document URL is not available');
    }
  };
  
  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;
    
    try {
      const success = await deleteDocument(documentToDelete);
      if (success) {
        toast.success('Document deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    } finally {
      setDocumentToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setUploadDialogOpen(true)} disabled={!isAuthenticated}>
          <Plus className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="py-8 text-center">
          <div className="mx-auto bg-muted rounded-full w-12 h-12 flex items-center justify-center mb-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No documents found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? "Try adjusting your search" : "Upload a document to get started"}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Document</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Size</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Uploaded</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="border-t hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{doc.name}</span>
                        {doc.description && <span className="text-xs text-muted-foreground">{doc.description}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{doc.category}</td>
                    <td className="px-4 py-3 text-sm">{formatBytes(doc.file_size)}</td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(doc.uploaded_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleOpenPreview(doc)}
                          title="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDownload(doc)}
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {isAuthenticated && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                title="Delete"
                                onClick={() => setDocumentToDelete(doc.id)}
                              >
                                <Trash className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the document.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDocumentToDelete(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteDocument}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <DocumentUploadDialog
        open={uploadDialogOpen}
        setOpen={setUploadDialogOpen}
        onSuccess={refreshDocuments}
        associationId={associationId}
        category={category === 'all' ? undefined : category}
      />

      <DocumentPreview
        document={selectedDocument}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
};

export default DocumentList;
