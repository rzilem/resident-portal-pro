import React, { useState, useCallback } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow, TableCaption 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, Download, Eye, Share2, Star, 
  MoreVertical, FileIcon, BarChart2, File,
  Calendar, User, Clock, Tag, Filter, RefreshCw
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DocumentFile, DocumentSearchFilters } from '@/types/documents';
import { getDocuments, formatFileSize } from '@/utils/documents/documentUtils';
import DocumentPreview from './DocumentPreview';
import DocumentActions from './DocumentActions';
import { toast } from 'sonner';

interface DocumentTableProps {
  category?: string;
  searchQuery?: string;
  filter?: 'recent' | 'shared' | 'important';
  associationId?: string;
  caption?: string;
  refreshTrigger?: number;
}

const DocumentTable: React.FC<DocumentTableProps> = ({ 
  category, 
  searchQuery = '',
  filter,
  associationId,
  caption,
  refreshTrigger = 0
}) => {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [sortOrder, setSortOrder] = useState<'name' | 'date' | 'size'>('date');
  const [tagFilter, setTagFilter] = useState('');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [loadKey, setLoadKey] = useState(0);
  
  React.useEffect(() => {
    loadDocuments();
  }, [category, searchQuery, localSearchQuery, filter, associationId, tagFilter, dateFilter, refreshTrigger, loadKey]);
  
  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters: DocumentSearchFilters = {
        query: searchQuery || localSearchQuery,
        categories: category ? [category] : [],
        tags: tagFilter ? [tagFilter] : []
      };
      
      if (dateFilter === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filters.dateRange = {
          start: today.toISOString(),
          end: new Date().toISOString()
        };
      } else if (dateFilter === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filters.dateRange = {
          start: weekAgo.toISOString(),
          end: new Date().toISOString()
        };
      } else if (dateFilter === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filters.dateRange = {
          start: monthAgo.toISOString(),
          end: new Date().toISOString()
        };
      }
      
      if (filter === 'shared') {
        filters.isPublic = true;
      } else if (filter === 'important') {
        filters.tags = ['important'];
      }
      
      console.log('Loading documents with filters:', filters);
      const docs = await getDocuments(filters, associationId);
      console.log('Loaded documents:', docs);
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [category, searchQuery, localSearchQuery, filter, associationId, tagFilter, dateFilter]);
  
  const refreshDocuments = () => {
    setLoadKey(prevKey => prevKey + 1);
  };
  
  const handleViewDocument = (doc: DocumentFile) => {
    setSelectedDocument(doc);
    setShowPreview(true);
  };
  
  const handleDownloadDocument = (doc: DocumentFile) => {
    toast.success(`Downloading ${doc.name}`);
  };
  
  const handleDeleteDocument = (doc: DocumentFile) => {
    toast.success(`Document "${doc.name}" deleted`);
    setDocuments(documents.filter(d => d.id !== doc.id));
  };
  
  const sortedDocuments = [...documents].sort((a, b) => {
    if (sortOrder === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === 'date') {
      return new Date(b.uploadedDate).getTime() - new Date(a.uploadedDate).getTime();
    } else if (sortOrder === 'size') {
      return b.fileSize - a.fileSize;
    }
    return 0;
  });
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-14 bg-muted rounded-md"></div>
        ))}
      </div>
    );
  }

  if (sortedDocuments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10">
        <FileText className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No documents found</h3>
        <p className="text-muted-foreground mt-1">
          {searchQuery || localSearchQuery
            ? `No results for "${searchQuery || localSearchQuery}"`
            : associationId
              ? 'No documents available for this association'
              : 'No documents match the current filters'}
        </p>
        <Button variant="outline" className="mt-4" onClick={refreshDocuments}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Documents
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter documents..."
            className="pl-9 w-full max-w-xs"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={refreshDocuments} title="Refresh documents">
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger className="w-[160px]">
              <Tag className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Tags</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="rules">Rules</SelectItem>
              <SelectItem value="important">Important</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Date uploaded" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
            <SelectTrigger className="w-[160px]">
              <Clock className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Most Recent</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="size">Size (Largest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          {caption && <TableCaption>{caption}</TableCaption>}
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDocuments.map(doc => (
              <TableRow key={doc.id}>
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
                      onClick={() => handleViewDocument(doc)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="Download"
                      onClick={() => handleDownloadDocument(doc)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    <DocumentActions
                      document={doc}
                      onView={handleViewDocument}
                      onDelete={handleDeleteDocument}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <DocumentPreview
        document={selectedDocument}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
};

export default DocumentTable;
