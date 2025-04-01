
import React from 'react';
import { DocumentFile } from '@/types/documents';
import { formatBytes } from '@/utils/documents/fileUtils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, Tag, FileType, HardDrive } from 'lucide-react';

interface DocumentDetailsContentProps {
  document: DocumentFile;
}

const DocumentDetailsContent: React.FC<DocumentDetailsContentProps> = ({ document }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Uploaded Date
              </dt>
              <dd className="mt-1">{formatDate(document.uploadedDate)}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Last Modified
              </dt>
              <dd className="mt-1">{formatDate(document.lastModified)}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileType className="h-4 w-4" />
                File Type
              </dt>
              <dd className="mt-1">{document.fileType || 'Unknown'}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                File Size
              </dt>
              <dd className="mt-1">{formatBytes(document.fileSize)}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Uploaded By
              </dt>
              <dd className="mt-1">{document.uploadedBy || 'Unknown'}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </dt>
              <dd className="mt-1 flex flex-wrap gap-1">
                {document.tags && document.tags.length > 0 ? (
                  document.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">No tags</span>
                )}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      
      {document.description && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium mb-2">Description</h3>
            <p className="text-sm">{document.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentDetailsContent;
