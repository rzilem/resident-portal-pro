
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import DocumentUploadDialog from '@/components/documents/DocumentUploadDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Plus, FileUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Document {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  created_at?: string;
  file_size: number;
  file_type: string;
  is_public: boolean;
  is_archived: boolean;
  last_modified: string;
  version: number;
  uploaded_date?: string;
  uploaded_by?: string;
  association_id: string;
  updated_at?: string;
  tags?: string[];
}

const DocumentsTab: React.FC<{ associationId: string }> = ({ associationId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('association_id', associationId);

      if (error) {
        toast.error("Failed to fetch documents");
        console.error("Fetch documents error:", error.message);
        return;
      }

      // Convert Supabase data to match our Document interface
      const formattedDocuments: Document[] = (data || []).map(doc => ({
        id: doc.id,
        name: doc.name,
        category: doc.category,
        description: doc.description || '',
        url: doc.url,
        file_size: doc.file_size,
        file_type: doc.file_type,
        is_public: doc.is_public,
        is_archived: doc.is_archived,
        last_modified: doc.last_modified,
        version: doc.version,
        uploaded_date: doc.uploaded_date || doc.last_modified || new Date().toISOString(),
        uploaded_by: doc.uploaded_by,
        association_id: doc.association_id,
        // Use existing fields as fallbacks if these fields don't exist
        created_at: doc.uploaded_date || doc.last_modified || new Date().toISOString(),
        updated_at: doc.last_modified || new Date().toISOString(),
        tags: doc.tags
      }));

      setDocuments(formattedDocuments);
    } catch (error: unknown) {
      console.error("Unexpected error fetching documents:", error);
      toast.error("Error fetching documents");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [associationId]);

  // Format bytes to readable size (KB, MB, etc.)
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Documents</CardTitle>
        <Button onClick={() => setOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No documents found</p>
            <Button onClick={() => setOpen(true)} variant="outline" className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        ) : (
          <div>
            {isMobile ? (
              <div className="space-y-3">
                {documents.map(doc => (
                  <div key={doc.id} className="bg-card border rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-muted p-2 rounded">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{doc.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{doc.category}</p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground grid grid-cols-2 gap-x-2 gap-y-1 mb-3">
                      <div>Size: {formatBytes(doc.file_size)}</div>
                      <div>Type: {doc.file_type.split('/')[1]?.toUpperCase() || doc.file_type}</div>
                      <div>Added: {new Date(doc.created_at || '').toLocaleDateString()}</div>
                      <div>Version: {doc.version || 1}</div>
                    </div>
                    <div className="flex justify-end">
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center text-xs bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3 py-2 rounded-md transition-colors"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-2">
                {documents.map(doc => (
                  <li key={doc.id} className="p-3 border rounded-md flex justify-between items-center">
                    <div>
                      <div className="font-medium">{doc.name}</div>
                      <div className="text-sm text-muted-foreground">{doc.category} - {doc.description}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatBytes(doc.file_size)} • Added: {new Date(doc.created_at || '').toLocaleDateString()}
                      </div>
                    </div>
                    <a 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-4 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </CardContent>
      <DocumentUploadDialog
        open={open}
        setOpen={setOpen}
        onSuccess={fetchDocuments}
        associationId={associationId}
      />
    </Card>
  );
};

export default DocumentsTab;
