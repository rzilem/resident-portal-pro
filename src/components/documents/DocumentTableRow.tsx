
import React from 'react';
import { 
  TableRow, TableCell
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";
import { DocumentFile } from '@/types/documents';
import { getDocumentIcon, formatDate, formatFileSize } from './utils/documentIconUtils';
import DocumentActions from './DocumentActions';

interface DocumentTableRowProps {
  doc: DocumentFile;
  onView: (doc: DocumentFile) => void;
  onDownload: (doc: DocumentFile) => void;
  onDelete: (doc: DocumentFile) => void;
}

const DocumentTableRow: React.FC<DocumentTableRowProps> = ({
  doc,
  onView,
  onDownload,
  onDelete
}) => {
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
            onClick={() => onView(doc)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            title="Download"
            onClick={() => onDownload(doc)}
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <DocumentActions
            document={doc}
            onView={onView}
            onDelete={onDelete}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default DocumentTableRow;
