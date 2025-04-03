
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { File } from 'lucide-react';
import { DocumentCategory, DocumentAccessLevel } from '@/types/documents';
import { renderAccessLevelBadge } from '../../../documents/utils/categoryUtils.tsx';

interface SecurityLevelTableProps {
  categories: DocumentCategory[];
  onAccessLevelChange: (categoryId: string, accessLevel: DocumentAccessLevel) => void;
}

const SecurityLevelTable: React.FC<SecurityLevelTableProps> = ({ 
  categories, 
  onAccessLevelChange 
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Current Access Level</TableHead>
            <TableHead>Access Level</TableHead>
            <TableHead>Visibility to Homeowner Portal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map(category => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4" />
                  {category.name}
                </div>
              </TableCell>
              <TableCell>
                {renderAccessLevelBadge(category.accessLevel || 'all')}
              </TableCell>
              <TableCell>
                <Select 
                  value={category.accessLevel || 'all'} 
                  onValueChange={(value) => onAccessLevelChange(category.id, value as DocumentAccessLevel)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Access Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="homeowner">Homeowners & Above</SelectItem>
                    <SelectItem value="board">Board Members & Above</SelectItem>
                    <SelectItem value="management">Management Staff Only</SelectItem>
                    <SelectItem value="admin">Administrators Only</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {category.accessLevel === 'all' || category.accessLevel === 'homeowner' ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Visible</Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-100">Not Visible</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SecurityLevelTable;
