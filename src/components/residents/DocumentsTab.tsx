import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import DocumentUploadDialog from '@/components/documents/DocumentUploadDialog';

interface Document {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  created_at: string;
}

const DocumentsTab: React.FC<{ associationId: string }> = ({ associationId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [open, setOpen] = useState(false);

  const fetchDocuments = async () => {
    try {
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
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [associationId]);

  return (
    <div>
      <h2>Documents</h2>
      <button onClick={() => setOpen(true)}>Upload Document</button>
      <DocumentUploadDialog
        open={open}
        setOpen={setOpen}
        onSuccess={fetchDocuments}
        associationId={associationId}
      />
      <ul>
        {documents.map(doc => (
          <li key={doc.id}>
            {doc.title} ({doc.category}) - {doc.description}
            <a href={doc.url} target="_blank" rel="noopener noreferrer">Download</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentsTab;
