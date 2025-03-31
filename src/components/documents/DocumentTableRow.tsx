
import React from 'react';
import { 
  TableRow, TableCell
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { DocumentFile } from '@/types/documents';
import DocumentActions from './DocumentActions';
import { getDocumentIcon, formatDate } from './utils/documentIconUtils';
import { formatFileSize } from '@/utils/documents/documentUtils';
import { toast } from "sonner";
import { debugLog, infoLog } from '@/utils/debug';

interface DocumentTableRowProps {
  doc: DocumentFile;
  onView: (doc: DocumentFile) => void;
  onDownload: (doc: DocumentFile) => void;
  onDelete: (doc: DocumentFile) => void;
  refreshDocuments?: () => void;
}

const DocumentTableRow: React.FC<DocumentTableRowProps> = ({
  doc,
  onView,
  onDownload,
  onDelete,
  refreshDocuments
}) => {
  const handleDownload = () => {
    if (!doc.url) {
      toast.error("Document URL is not available");
      return;
    }
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.name;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Also call the provided onDownload callback
    onDownload(doc);
  };

  const handleView = () => {
    infoLog(`Viewing document: ${doc.name}`, {
      docId: doc.id,
      docUrl: doc.url,
      docType: doc.fileType
    });
    
    // Ensure we have a fileType property
    const documentToView = {
      ...doc,
      fileType: doc.fileType || doc.name.split('.').pop() || ''
    };
    
    // Call the view handler
    onView(documentToView);
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          {getDocumentIcon(doc.name)}
          <div>
            <div className="font-medium flex items-center gap-1">
              {doc.name}
              {doc.version > 1 && (
                <Badge variant="outline" className="text-xs">v{doc.version}</Badge>
              )}
            </div>
            {doc.description && (
              <div className="text-xs text-muted-foreground">{doc.description}</div>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>{formatDate(doc.uploadedDate)}</TableCell>
      <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
      <TableCell>{doc.uploadedBy}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {doc.tags?.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            title="View"
            onClick={handleView}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            title="Download"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <DocumentActions
            document={doc}
            onView={onView}
            onDelete={onDelete}
            refreshDocuments={refreshDocuments}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default DocumentTableRow;
