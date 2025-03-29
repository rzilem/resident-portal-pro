
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface Document {
  id: string;
  name: string;
  url?: string;
  uploadDate: string;
}

interface DocumentsCardProps {
  documents: Document[];
}

const DocumentsCard: React.FC<DocumentsCardProps> = ({ documents }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

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
        <div className="space-y-2">
          {documents.map(doc => (
            <div key={doc.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <div className="font-medium">{doc.name}</div>
                <div className="text-xs text-muted-foreground">
                  Uploaded on {formatDate(doc.uploadDate)}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
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
