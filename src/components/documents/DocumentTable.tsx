
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Download, MoreHorizontal, Tag, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentFile } from '@/types/documents';
import DocumentTableEmptyState from './DocumentTableEmptyState';
import DocumentTableLoading from './DocumentTableLoading';
import DocumentPreview from './DocumentPreview';
import { Badge } from '@/components/ui/badge';
import { getDocuments } from '@/utils/documents';
import { formatFileSize, formatDate, getFileIcon } from './utils/documentIconUtils';

interface DocumentTableProps {
  category?: string;
  searchQuery?: string;
  filter?: 'recent' | 'shared' | 'important';
  associationId?: string;
  refreshTrigger?: number;
}

const DocumentTable: React.FC<DocumentTableProps> = ({
  category = '',
  searchQuery = '',
  filter,
  associationId,
  refreshTrigger = 0
}) => {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Load documents based on category and search query
  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        // Build the search filters
        const searchFilters: any = {
          isArchived: false
        };
        
        // Add category filter if provided
        if (category) {
          searchFilters.categories = [category];
        }
        
        // Handle the filter type
        if (filter === 'recent') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          searchFilters.dateRange = {
            start: thirtyDaysAgo.toISOString()
          };
        } else if (filter === 'shared') {
          searchFilters.isPublic = true;
        } else if (filter === 'important') {
          searchFilters.tags = ['important'];
        }
        
        // If association ID provided, filter by it
        if (associationId) {
          searchFilters.associations = [associationId];
        }
        
        const docs = await getDocuments(searchFilters, searchQuery);
        setDocuments(docs);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDocuments();
  }, [category, searchQuery, filter, associationId, refreshTrigger]);
  
  const handleViewDocument = (document: DocumentFile) => {
    setSelectedDocument(document);
    setShowPreview(true);
  };
  
  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedDocument(null);
  };

  if (isLoading) {
    return <DocumentTableLoading />;
  }

  if (documents.length === 0) {
    return <DocumentTableEmptyState searchQuery={searchQuery} category={category} />;
  }

  return (
    <div className="space-y-3">
      <div className="rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="h-10 px-4 text-left align-middle font-medium">Document</th>
              <th className="h-10 px-2 text-left align-middle font-medium">Type</th>
              <th className="h-10 px-2 text-left align-middle font-medium hidden md:table-cell">Size</th>
              <th className="h-10 px-2 text-left align-middle font-medium hidden lg:table-cell">Uploaded</th>
              <th className="h-10 px-2 text-left align-middle font-medium hidden xl:table-cell">Tags</th>
              <th className="h-10 px-2 text-right align-middle font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id} className="border-b transition-colors hover:bg-muted/50">
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-2">
                    {getFileIcon(document.fileType)}
                    <div>
                      <div className="font-medium">{document.name}</div>
                      {document.description && (
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {document.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-2 align-middle">
                  <div className="text-xs uppercase text-muted-foreground">
                    {document.fileType.split('/')[1] || document.fileType}
                  </div>
                </td>
                <td className="px-2 align-middle hidden md:table-cell">
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(document.fileSize)}
                  </div>
                </td>
                <td className="px-2 align-middle hidden lg:table-cell">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(document.uploadedDate)}
                  </div>
                </td>
                <td className="px-2 align-middle hidden xl:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {document.tags && document.tags.length > 0 ? document.tags.slice(0, 2).map((tag, idx) => (
                      <Badge variant="outline" key={idx} className="text-xs">
                        {tag}
                      </Badge>
                    )) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                    {document.tags && document.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{document.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="p-2 align-middle text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleViewDocument(document)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                    >
                      <a href={document.url} download={document.name}>
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </a>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDocument(document)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href={document.url} download={document.name} className="flex cursor-pointer items-center">
                            <Download className="mr-2 h-4 w-4" />
                            <span>Download</span>
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Tag className="mr-2 h-4 w-4" />
                          <span>Add Tag</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <DocumentPreview
        document={selectedDocument}
        isOpen={showPreview}
        onClose={handleClosePreview}
      />
    </div>
  );
};

export default DocumentTable;
