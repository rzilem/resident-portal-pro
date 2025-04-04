
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  url?: string;
  uploadDate: string;
}

interface DocumentsCardProps {
  documents: Document[];
  isLoading?: boolean;
}

const DocumentsCard: React.FC<DocumentsCardProps> = ({ documents, isLoading = false }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleDownload = (document: Document) => {
    if (!document.url) {
      toast.error('Document URL not available');
      return;
    }
    
    // Open the URL in a new tab
    window.open(document.url, '_blank');
  };

  const handleView = (document: Document) => {
    if (!document.url) {
      toast.error('Document URL not available');
      return;
    }
    
    // Open the URL in a new tab
    window.open(document.url, '_blank');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Insurance Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm flex justify-center items-center py-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (documents.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="text-muted-foreground">No insurance documents uploaded</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Insurance Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {documents.map(doc => (
            <div key={doc.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <div className="font-medium">{doc.name}</div>
                <div className="text-xs text-muted-foreground">
                  Uploaded on {formatDate(doc.uploadDate)}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0"
                  onClick={() => handleView(doc)}
                  disabled={!doc.url}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0"
                  onClick={() => handleDownload(doc)}
                  disabled={!doc.url}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsCard;
