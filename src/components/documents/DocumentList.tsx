
import React, { useState } from 'react';
import { DocumentFile } from '@/types/documents';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Search, File } from 'lucide-react';
import DocumentPreview from './preview/DocumentPreview';
import DocumentGrid from './DocumentGrid';
import DocumentTable from './DocumentTable';
import NoDocumentsPlaceholder from './NoDocumentsPlaceholder';

interface DocumentListProps {
  documents: DocumentFile[];
  loading?: boolean;
  error?: string | null;
  viewMode?: 'grid' | 'table';
  onDeleteDocument?: (id: string) => Promise<boolean>;
  onDownloadDocument?: (document: DocumentFile) => Promise<boolean>;
  onRefresh?: () => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  loading = false,
  error = null,
  viewMode = 'table',
  onDeleteDocument,
  onDownloadDocument,
  onRefresh
}) => {
  const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const handleViewDocument = (document: DocumentFile) => {
    setSelectedDocument(document);
    setPreviewOpen(true);
  };
  
  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center justify-center gap-2 py-8">
            <Search className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">Error Loading Documents</h3>
            <p className="text-muted-foreground mb-4">
              {error}
            </p>
            {onRefresh && (
              <Button variant="outline" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <NoDocumentsPlaceholder onRefresh={onRefresh} />
    );
  }

  return (
    <div>
      {viewMode === 'grid' ? (
        <DocumentGrid 
          documents={documents}
          onViewDocument={handleViewDocument}
          onDeleteDocument={onDeleteDocument}
          onDownloadDocument={onDownloadDocument}
        />
      ) : (
        <DocumentTable 
          documents={documents}
          onViewDocument={handleViewDocument}
          onDeleteDocument={onDeleteDocument}
          onDownloadDocument={onDownloadDocument}
        />
      )}
      
      <DocumentPreview 
        document={selectedDocument}
        isOpen={previewOpen}
        onClose={handleClosePreview}
      />
    </div>
  );
};

export default DocumentList;
