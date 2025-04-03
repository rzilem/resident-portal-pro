
import React from 'react';
import { DocumentFile } from '@/types/documents';
import { formatDate, formatFileSize } from '@/utils/documents/documentUtils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface DocumentDetailsProps {
  document: DocumentFile;
}

const DocumentDetails: React.FC<DocumentDetailsProps> = ({ document }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Document Information</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Name</h4>
                <p className="text-sm">{document.name}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Size</h4>
                <p className="text-sm">{formatFileSize(document.fileSize || 0)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Type</h4>
                <p className="text-sm">{document.fileType || 'Unknown'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Uploaded</h4>
                <p className="text-sm">{formatDate(document.uploadedDate)}</p>
              </div>
              
              {document.lastModified && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Modified</h4>
                  <p className="text-sm">{formatDate(document.lastModified)}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Category</h4>
                <p className="text-sm capitalize">{document.category || 'General'}</p>
              </div>
              
              {document.uploadedBy && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Uploaded By</h4>
                  <p className="text-sm">{document.uploadedBy}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Visibility</h4>
                <p className="text-sm">{document.isPublic ? 'Public' : 'Private'}</p>
              </div>
              
              {document.description && (
                <div className="col-span-1 md:col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                  <p className="text-sm">{document.description}</p>
                </div>
              )}
              
              {document.tags && document.tags.length > 0 && (
                <div className="col-span-1 md:col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Tags</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {document.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Document Properties</h3>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Version</h4>
                <p className="text-sm">{document.version || '1'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                <p className="text-sm">{document.isArchived ? 'Archived' : 'Active'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">ID</h4>
                <p className="text-sm font-mono text-xs">{document.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentDetails;
