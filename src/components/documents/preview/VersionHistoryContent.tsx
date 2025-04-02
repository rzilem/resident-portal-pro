
import React from 'react';
import { DocumentFile } from '@/types/documents';
import { Clock, Download, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VersionHistoryContentProps {
  document: DocumentFile;
}

const VersionHistoryContent: React.FC<VersionHistoryContentProps> = ({ document }) => {
  if (!document.previousVersions || document.previousVersions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No version history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Version History</h3>
      <div className="border rounded-md">
        <div className="p-3 border-b bg-muted/50 flex justify-between">
          <div className="font-medium flex items-center gap-1 text-sm">
            Current (Version {document.version})
          </div>
          <div className="text-muted-foreground text-xs">
            {document.lastModified ? new Date(document.lastModified).toLocaleString() : 'Unknown'}
          </div>
        </div>
        
        <ul className="divide-y">
          {document.previousVersions.map((version, index) => (
            <li key={index} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">Version {version.version}</div>
                <Button variant="ghost" size="sm" className="h-7 px-2.5 py-1">
                  <Download className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Download</span>
                </Button>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(version.lastModified).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{version.modifiedBy}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VersionHistoryContent;
