import React, { useState, useEffect } from 'react';
import { documentService, DocumentMetadata } from '@/services/documentService';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Download, 
  Trash2, 
  Search, 
  FileText, 
  File,
  FileImage,
  FileSpreadsheet,
  FileIcon
} from 'lucide-react';
import DocumentUploadButton from './DocumentUploadButton';
import { formatBytes, formatDate } from '@/utils/formatters';
import { useAuth } from '@/hooks/use-auth';

interface DocumentListProps {
  associationId: string;
  category?: string;
}

const DocumentList: React.FC<DocumentListProps> = ({ 
  associationId,
  category
}) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const docs = await documentService.getDocuments(associationId, category);
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (associationId) {
      fetchDocuments();
    }
  }, [associationId, category]);
  
  const handleDeleteDocument = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      const success = await documentService.deleteDocument(id, associationId);
      if (success) {
        fetchDocuments();
      }
    }
  };
  
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Function to get the appropriate icon based on file type
  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(type)) {
      return <FileImage className="h-5 w-5 text-blue-500" />;
    } else if (['pdf'].includes(type)) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (['xls', 'xlsx', 'csv'].includes(type)) {
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    } else if (['doc', 'docx', 'txt', 'rtf'].includes(type)) {
      return <FileText className="h-5 w-5 text-indigo-500" />;
    }
    return <File className="h-5 w-5 text-gray-500" />;
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>
            {category ? `${category} Documents` : 'Association Documents'}
          </CardTitle>
          
          {user && (
            <DocumentUploadButton 
              associationId={associationId}
              onSuccess={fetchDocuments}
              category={category}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredDocuments.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Size</TableHead>
                    <TableHead className="hidden md:table-cell">Uploaded</TableHead>
                    <TableHead className="hidden md:table-cell">Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getFileIcon(doc.fileType)}
                          <span className="font-medium">{doc.name}</span>
                        </div>
                        {doc.description && (
                          <span className="text-xs text-muted-foreground block md:hidden mt-1">
                            {doc.description}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell uppercase text-xs">
                        {doc.fileType}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatBytes(doc.fileSize)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(doc.uploadedDate)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {doc.tags && doc.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(doc.url, '_blank')}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {user && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery 
                  ? `No documents match "${searchQuery}"` 
                  : 'No documents available'}
              </p>
              {user && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => document.getElementById('upload-document-button')?.click()}
                >
                  Upload your first document
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentList;
