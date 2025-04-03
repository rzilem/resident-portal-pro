
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
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

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
    
    try {
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
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document");
    }
  };

  const handleView = () => {
    // Make sure we have the file type before viewing
    if (!doc.fileType) {
      const fileExtension = doc.name.split('.').pop()?.toLowerCase() || '';
      infoLog(`No fileType found, inferring from extension: ${fileExtension}`, {
        docId: doc.id,
        docName: doc.name
      });
      
      // Add fileType based on extension
      const updatedDoc = {
        ...doc,
        fileType: doc.fileType || fileExtension
      };
      
      onView(updatedDoc);
    } else {
      infoLog(`Viewing document: ${doc.name}`, {
        docId: doc.id,
        docUrl: doc.url,
        docType: doc.fileType
      });
      
      onView(doc);
    }
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleView}
                  className="hover:bg-muted"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Preview document</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleDownload}
                  className="hover:bg-muted"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download document</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
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
