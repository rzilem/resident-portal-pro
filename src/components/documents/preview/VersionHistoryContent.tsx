
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';
import { DocumentFile } from '@/types/documents';
import { formatDate } from '@/utils/documents/documentUtils';

interface VersionHistoryContentProps {
  document: DocumentFile;
}

const VersionHistoryContent: React.FC<VersionHistoryContentProps> = ({ document }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Version History</h3>
        <div className="space-y-4">
          <div className="p-3 border rounded-md bg-primary/5">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Current Version (v{document.version})</p>
                <p className="text-sm text-muted-foreground">
                  Modified: {document.lastModified ? formatDate(document.lastModified) : 'N/A'}
                </p>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </div>
          </div>
          
          {document.previousVersions?.map(version => (
            <div key={version.version} className="p-3 border rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Version {version.version}</p>
                  <p className="text-sm text-muted-foreground">
                    Modified: {formatDate(version.lastModified)} by {version.modifiedBy}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VersionHistoryContent;
