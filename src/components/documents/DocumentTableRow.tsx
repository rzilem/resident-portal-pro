
import React from 'react';
import { 
  TableRow, TableCell
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, FileText, FileSpreadsheet } from "lucide-react";
import { DocumentFile } from '@/types/documents';
import DocumentActions from './DocumentActions';

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
  // Helper function to format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get appropriate icon based on file type
  const getDocumentIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (extension === 'pdf') {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else if (['doc', 'docx'].includes(extension || '')) {
      return <FileText className="h-4 w-4 text-blue-500" />;
    } else if (['xls', 'xlsx', 'csv'].includes(extension || '')) {
      return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
    }
    
    return <FileText className="h-4 w-4 text-gray-500" />;
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
            refreshDocuments={refreshDocuments}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default DocumentTableRow;
