
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, Info, Tag } from 'lucide-react';
import { DocumentFile } from '@/types/documents';
import { formatFileSize, formatDate } from '@/utils/documents/documentUtils';

interface DocumentDetailsContentProps {
  document: DocumentFile;
}

const DocumentDetailsContent: React.FC<DocumentDetailsContentProps> = ({ document }) => {
  return (
    <div className="space-y-4 flex-1 overflow-auto">
      <Card>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Upload Date
              </h3>
              <p>{formatDate(document.uploadedDate)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Uploaded By
              </h3>
              <p>{document.uploadedBy}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Last Modified
              </h3>
              <p>{document.lastModified ? formatDate(document.lastModified) : 'N/A'}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                File Size
              </h3>
              <p>{formatFileSize(document.fileSize)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                File Type
              </h3>
              <p>{document.fileType}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Version
              </h3>
              <p>v{document.version}</p>
            </div>
            
            {document.expirationDate && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Expiration Date
                </h3>
                <p>{formatDate(document.expirationDate)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {document.tags && document.tags.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {document.tags.map(tag => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentDetailsContent;
