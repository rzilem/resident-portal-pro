
import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, Download, Eye, Share2, Star, 
  MoreVertical, FileIcon, BarChart2 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentTableProps {
  category?: string;
  searchQuery?: string;
  filter?: 'recent' | 'shared' | 'important';
}

// Sample document data
const sampleDocuments = [
  {
    id: 'doc1',
    name: 'Annual Budget 2023.pdf',
    category: 'financials',
    uploadDate: '2023-11-15',
    size: '1.2 MB',
    uploadedBy: 'Maria Rodriguez',
    tags: ['important', 'board', 'financial'],
    isShared: true,
    isImportant: true,
  },
  {
    id: 'doc2',
    name: 'Board Meeting Minutes - October.docx',
    category: 'communityMeetings',
    uploadDate: '2023-10-05',
    size: '350 KB',
    uploadedBy: 'David Johnson',
    tags: ['meeting', 'board'],
    isShared: true,
    isImportant: false,
  },
  {
    id: 'doc3',
    name: 'Maintenance Schedule Q4.xlsx',
    category: 'maintenance',
    uploadDate: '2023-10-10',
    size: '450 KB',
    uploadedBy: 'Sarah Williams',
    tags: ['operations'],
    isShared: false,
    isImportant: false,
  },
  {
    id: 'doc4',
    name: 'Community Guidelines Updated.pdf',
    category: 'communityDocuments',
    uploadDate: '2023-09-20',
    size: '2.1 MB',
    uploadedBy: 'Thomas Miller',
    tags: ['important', 'residents'],
    isShared: true,
    isImportant: true,
  },
  {
    id: 'doc5',
    name: 'Insurance Policy Renewal.pdf',
    category: 'financials',
    uploadDate: '2023-09-10',
    size: '4.7 MB',
    uploadedBy: 'Alex Lee',
    tags: ['legal', 'important'],
    isShared: false,
    isImportant: true,
  },
  {
    id: 'doc6',
    name: 'Pool Area Renovation Proposal.pdf',
    category: 'maintenance',
    uploadDate: '2023-10-18',
    size: '3.5 MB',
    uploadedBy: 'Maria Rodriguez',
    tags: ['projects'],
    isShared: false,
    isImportant: false,
  },
  {
    id: 'doc7',
    name: 'Q3 Financial Statement.pdf',
    category: 'monthlyFinancialReports',
    uploadDate: '2023-10-02',
    size: '980 KB',
    uploadedBy: 'David Johnson',
    tags: ['financial', 'quarterly'],
    isShared: true,
    isImportant: true,
  },
];

const getDocumentIcon = (name: string) => {
  const extension = name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return <FileText className="h-5 w-5 text-red-500" />;
    case 'xlsx':
    case 'xls':
      return <BarChart2 className="h-5 w-5 text-green-500" />;
    case 'docx':
    case 'doc':
      return <FileText className="h-5 w-5 text-blue-500" />;
    default:
      return <FileIcon className="h-5 w-5 text-gray-500" />;
  }
};

const DocumentTable: React.FC<DocumentTableProps> = ({ 
  category, 
  searchQuery = '',
  filter
}) => {
  // Filter documents based on the selected category, search query and filter
  const filteredDocuments = sampleDocuments.filter(doc => {
    // Apply category filter
    if (category && doc.category !== category) {
      return false;
    }
    
    // Apply search query
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply additional filters
    if (filter === 'recent') {
      // Show documents from the last 30 days (simplified for demo)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return new Date(doc.uploadDate) >= thirtyDaysAgo;
    }
    
    if (filter === 'shared') {
      return doc.isShared;
    }
    
    if (filter === 'important') {
      return doc.isImportant;
    }
    
    return true;
  });

  if (filteredDocuments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10">
        <FileText className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No documents found</h3>
        <p className="text-muted-foreground mt-1">
          {searchQuery 
            ? `No results for "${searchQuery}"` 
            : 'Upload documents to get started'}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
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
          {filteredDocuments.map(doc => (
            <TableRow key={doc.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getDocumentIcon(doc.name)}
                  <span className="font-medium">{doc.name}</span>
                  {doc.isImportant && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
                </div>
              </TableCell>
              <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
              <TableCell>{doc.size}</TableCell>
              <TableCell>{doc.uploadedBy}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {doc.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" title="View">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Download">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Share">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuItem>Move</DropdownMenuItem>
                      <DropdownMenuItem>Add Tags</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentTable;
