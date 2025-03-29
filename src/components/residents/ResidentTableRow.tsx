
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { ChevronDown, Mail, Download, Trash2, Tag } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { ResidentColumn } from '@/pages/Residents';

interface ResidentTableRowProps {
  resident: any;
  columns: ResidentColumn[];
  selectedResidents: number[];
  toggleResidentSelection: (id: number) => void;
}

const ResidentTableRow: React.FC<ResidentTableRowProps> = ({ 
  resident, 
  columns, 
  selectedResidents, 
  toggleResidentSelection 
}) => {
  return (
    <TableRow>
      <TableCell>
        <Checkbox 
          checked={selectedResidents.includes(resident.id)} 
          onCheckedChange={() => toggleResidentSelection(resident.id)}
          id={`resident-${resident.id}`}
        />
      </TableCell>
      {columns.filter(col => col.checked).map((column) => (
        <TableCell key={column.id}>
          {column.id === 'name' ? (
            <Link 
              to={`/resident/${resident.id}`} 
              className="text-primary hover:underline hover:text-primary/80 transition-colors"
            >
              {resident.name}
            </Link>
          ) : column.id === 'property' ? (
            <Link 
              to={`/properties?filter=${encodeURIComponent(resident.property)}`} 
              className="hover:underline hover:text-primary/80 transition-colors"
            >
              {resident.property}
            </Link>
          ) : column.id === 'email' ? (
            <a 
              href={`mailto:${resident.email}`} 
              className="hover:underline hover:text-primary/80 transition-colors"
            >
              {resident.email}
            </a>
          ) : column.id === 'status' ? (
            <span className={`px-2 py-1 rounded-full text-xs ${
              resident.status === 'Active' ? 'bg-green-100 text-green-800' : 
              resident.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
              'bg-gray-100 text-gray-800'
            }`}>
              {resident.status}
            </span>
          ) : (
            resident[column.id as keyof typeof resident]
          )}
        </TableCell>
      ))}
      <TableCell>
        <div className="flex items-center gap-2">
          <Link to={`/resident/${resident.id}`}>
            <Button variant="ghost" size="sm">View</Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.open(`mailto:${resident.email}`)}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success(`Exporting ${resident.name}'s data`)}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success(`Tag dialog would open for ${resident.name}`)}>
                <Tag className="h-4 w-4 mr-2" />
                Manage Tags
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => toast.error(`Delete confirmation for ${resident.name}`)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ResidentTableRow;
