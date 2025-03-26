
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DatabaseColumn } from '../DatabaseColumnsSelector';
import { Homeowner } from '../types';

interface HomeownerTableHeaderProps {
  columns: DatabaseColumn[];
  sortColumn: keyof Homeowner;
  sortDirection: 'asc' | 'desc';
  handleSort: (column: keyof Homeowner) => void;
}

const HomeownerTableHeader: React.FC<HomeownerTableHeaderProps> = ({
  columns,
  sortColumn,
  sortDirection,
  handleSort,
}) => {
  return (
    <TableHeader>
      <TableRow>
        {columns.map(col => col.checked && (
          <TableHead 
            key={col.id}
            className={col.id === sortColumn ? "cursor-pointer hover:bg-muted/50" : "cursor-pointer hover:bg-muted/50"}
            onClick={() => col.id === 'id' || col.id === 'fullName' ? handleSort(col.id as keyof Homeowner) : undefined}
          >
            {col.label} {(col.id === 'id' || col.id === 'fullName') && col.id === sortColumn && (sortDirection === 'asc' ? '↑' : '↓')}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

export default HomeownerTableHeader;
