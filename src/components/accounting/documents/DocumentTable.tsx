
import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow, TableCaption 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FinancialDocument } from '@/components/settings/associations/types';
import DocumentTypeBadge from './DocumentTypeBadge';

interface DocumentTableProps {
  documents: FinancialDocument[];
  caption?: string;
}

const DocumentTable: React.FC<DocumentTableProps> = ({ documents, caption }) => {
  return (
    <div className="rounded-md border">
      <Table>
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            <TableHead>Document ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map(document => (
            <TableRow key={document.id}>
              <TableCell className="font-medium">{document.id}</TableCell>
              <TableCell>{document.title}</TableCell>
              <TableCell><DocumentTypeBadge type={document.type} /></TableCell>
              <TableCell>{new Date(document.uploadDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {document.tags?.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="outline" size="sm">Download</Button>
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
