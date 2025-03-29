
import React from 'react';
import { TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { ResidentColumn } from '@/pages/Residents';

interface ResidentTableHeaderProps {
  columns: ResidentColumn[];
  sortField: string;
  sortDirection: 'asc' | 'desc';
  handleSort: (field: string) => void;
  selectedResidents: number[];
  sortedResidents: any[];
  toggleSelectAll: () => void;
}

const ResidentTableHeader: React.FC<ResidentTableHeaderProps> = ({
  columns,
  sortField,
  sortDirection,
  handleSort,
  selectedResidents,
  sortedResidents,
  toggleSelectAll,
}) => {
  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[40px]">
          <Checkbox 
            checked={
              sortedResidents.length > 0 && 
              selectedResidents.length === sortedResidents.length
            } 
            onCheckedChange={toggleSelectAll}
            id="select-all-residents"
          />
        </TableHead>
        {columns.filter(col => col.checked).map((column) => (
          <TableHead 
            key={column.id}
            className="cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => handleSort(column.id)}
          >
            <div className="flex items-center gap-1">
              {column.label}
              <SortIcon field={column.id} />
            </div>
          </TableHead>
        ))}
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default ResidentTableHeader;
