
import React from 'react';
import { DocumentFile } from '@/types/documents';
import { formatBytes } from '@/utils/documents/fileUtils';
import { Button } from '@/components/ui/button';
import { Download, Clock, RefreshCw } from 'lucide-react';

interface VersionHistoryContentProps {
  document: DocumentFile;
}

const VersionHistoryContent: React.FC<VersionHistoryContentProps> = ({ document }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (!document.previousVersions || document.previousVersions.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No previous versions</h3>
        <p className="text-sm text-muted-foreground">
          This document doesn't have any previous versions
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Version History</h3>
      
      <div className="rounded-md border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left px-4 py-3 text-sm font-medium">Version</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Modified</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Modified By</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-3 text-sm">
                <div className="flex items-center">
                  <span className="font-medium">{document.version} (Current)</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm">{formatDate(document.lastModified)}</td>
              <td className="px-4 py-3 text-sm">{document.uploadedBy || 'Unknown'}</td>
              <td className="px-4 py-3 text-sm">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Download">
                  <Download className="h-4 w-4" />
                </Button>
              </td>
            </tr>
            
            {document.previousVersions.map((version, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center">
                    <span>{version.version}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{formatDate(version.lastModified)}</td>
                <td className="px-4 py-3 text-sm">{version.modifiedBy || 'Unknown'}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Download">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Restore this version">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VersionHistoryContent;
