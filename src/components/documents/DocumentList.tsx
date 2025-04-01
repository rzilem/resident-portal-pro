
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DocumentFile } from '@/types/documents';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Search, Plus, Filter, Download, Eye } from 'lucide-react';
import DocumentUploadDialog from './DocumentUploadDialog';
import DocumentPreview from './DocumentPreview';
import { formatBytes } from '@/utils/documents/fileUtils';

interface DocumentListProps {
  associationId?: string;
  category?: string;
}

const DocumentList: React.FC<DocumentListProps> = ({ associationId, category }) => {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('documents')
        .select('*')
        .eq('is_archived', false);

      if (associationId) {
        query = query.eq('association_id', associationId);
      }

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query.order('uploaded_date', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedDocuments: DocumentFile[] = data.map((doc) => ({
        id: doc.id,
        name: doc.name,
        description: doc.description || '',
        fileSize: doc.file_size,
        fileType: doc.file_type,
        url: doc.url,
        category: doc.category,
        tags: doc.tags || [],
        uploadedBy: doc.uploaded_by,
        uploadedDate: doc.uploaded_date || new Date().toISOString(),
        lastModified: doc.last_modified || new Date().toISOString(),
        version: doc.version || 1,
        isPublic: doc.is_public,
        isArchived: doc.is_archived,
        expirationDate: undefined,
        previousVersions: [],
        properties: [],
        associations: [doc.association_id],
        metadata: {}
      }));

      setDocuments(formattedDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [associationId, category]);

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenPreview = (document: DocumentFile) => {
    setSelectedDocument(document);
    setPreviewOpen(true);
  };

  const handleDownload = (document: DocumentFile) => {
    if (document.url) {
      window.open(document.url, '_blank');
    } else {
      toast.error('Document URL is not available');
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
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>

      {loading ? (
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
                    <td className="px-4 py-3 text-sm">{formatBytes(doc.fileSize)}</td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(doc.uploadedDate).toLocaleDateString()}
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
        onSuccess={fetchDocuments}
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
