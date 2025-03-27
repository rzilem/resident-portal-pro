
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import DocumentUploadDialog from '@/components/documents/DocumentUploadDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Plus } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  created_at: string;
  file_size: number;
  file_type: string;
  is_public: boolean;
  is_archived: boolean;
  last_modified: string;
  version: number;
}

const DocumentsTab: React.FC<{ associationId: string }> = ({ associationId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

      setDocuments(data || []);
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
          <ul className="space-y-2">
            {documents.map(doc => (
              <li key={doc.id} className="p-3 border rounded-md flex justify-between items-center">
                <div>
                  <div className="font-medium">{doc.name}</div>
                  <div className="text-sm text-muted-foreground">{doc.category} - {doc.description}</div>
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
