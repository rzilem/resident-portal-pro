
import React from 'react';
import { DocumentFile } from '@/types/documents';
import { Badge } from '@/components/ui/badge';
import { formatFileSize } from '@/utils/documents/documentUtils';

interface DocumentDetailsContentProps {
  document: DocumentFile;
}

const DocumentDetailsContent: React.FC<DocumentDetailsContentProps> = ({ document }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Document Information</h3>
          <div className="border rounded-md">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium bg-muted/50">Name</td>
                  <td className="py-2 px-4">{document.name}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium bg-muted/50">Type</td>
                  <td className="py-2 px-4">{document.fileType || 'Unknown'}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium bg-muted/50">Size</td>
                  <td className="py-2 px-4">{formatFileSize(document.fileSize)}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium bg-muted/50">Category</td>
                  <td className="py-2 px-4">{document.category || 'Uncategorized'}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium bg-muted/50">Version</td>
                  <td className="py-2 px-4">{document.version || 1}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Upload Information</h3>
          <div className="border rounded-md">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium bg-muted/50">Uploaded By</td>
                  <td className="py-2 px-4">{document.uploadedBy || 'Unknown'}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium bg-muted/50">Upload Date</td>
                  <td className="py-2 px-4">
                    {document.uploadedDate ? new Date(document.uploadedDate).toLocaleString() : 'Unknown'}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4 font-medium bg-muted/50">Last Modified</td>
                  <td className="py-2 px-4">
                    {document.lastModified ? new Date(document.lastModified).toLocaleString() : 'Unknown'}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium bg-muted/50">Public Access</td>
                  <td className="py-2 px-4">{document.isPublic ? 'Yes' : 'No'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {document.description && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Description</h3>
          <div className="border rounded-md p-4 text-sm">
            {document.description}
          </div>
        </div>
      )}
      
      {document.tags && document.tags.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Tags</h3>
          <div className="flex flex-wrap gap-2 border rounded-md p-4">
            {document.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {document.metadata && Object.keys(document.metadata).length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Metadata</h3>
          <div className="border rounded-md p-4">
            <pre className="text-xs overflow-auto max-h-36">
              {JSON.stringify(document.metadata, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentDetailsContent;
