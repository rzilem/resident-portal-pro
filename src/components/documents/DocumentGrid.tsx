
import React from 'react';
import { DocumentFile } from '@/types/documents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatFileSize, formatDate, getFileTypeInfo } from '@/utils/documents/documentUtils';
import { File, Download, Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DocumentGridProps {
  documents: DocumentFile[];
  onViewDocument?: (document: DocumentFile) => void;
  onDeleteDocument?: (id: string) => Promise<boolean>;
  onDownloadDocument?: (document: DocumentFile) => Promise<boolean>;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({
  documents,
  onViewDocument,
  onDeleteDocument,
  onDownloadDocument
}) => {
  const getIconComponent = (document: DocumentFile) => {
    const { icon } = getFileTypeInfo(document.fileType, document.name);
    
    switch (icon) {
      case 'pdf':
        return <File className="h-10 w-10 text-red-500" />;
      case 'word':
        return <File className="h-10 w-10 text-blue-500" />;
      case 'excel':
        return <File className="h-10 w-10 text-green-500" />;
      case 'powerpoint':
        return <File className="h-10 w-10 text-orange-500" />;
      case 'image':
        return <File className="h-10 w-10 text-purple-500" />;
      case 'text':
        return <File className="h-10 w-10 text-gray-500" />;
      case 'archive':
        return <File className="h-10 w-10 text-yellow-500" />;
      default:
        return <File className="h-10 w-10 text-gray-500" />;
    }
  };
  
  const handleView = (document: DocumentFile) => {
    if (onViewDocument) {
      onViewDocument(document);
    }
  };
  
  const handleDownload = async (document: DocumentFile) => {
    if (onDownloadDocument) {
      await onDownloadDocument(document);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (onDeleteDocument) {
      await onDeleteDocument(id);
    }
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {documents.map((document) => (
        <Card key={document.id} className="overflow-hidden">
          <div 
            className="p-4 flex flex-col items-center justify-center cursor-pointer h-40 border-b hover:bg-muted/50 transition-colors"
            onClick={() => handleView(document)}
          >
            {getIconComponent(document)}
            <h3 className="font-medium text-center mt-3 line-clamp-2">{document.name}</h3>
          </div>
          
          <CardContent className="p-3">
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Size:</span>
                <span>{formatFileSize(document.fileSize)}</span>
              </div>
              <div className="flex justify-between">
                <span>Uploaded:</span>
                <span>{formatDate(document.uploadedDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="capitalize">{document.category}</span>
              </div>
            </div>
            
            {document.tags && document.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {document.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {document.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{document.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="p-2 flex justify-between">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-9 h-9 p-0"
                    onClick={() => handleView(document)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View document</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-9 h-9 p-0"
                    onClick={() => handleDownload(document)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download document</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-9 h-9 p-0 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(document.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete document</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default DocumentGrid;
