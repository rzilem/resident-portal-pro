
import React from 'react';
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { InvoiceColumn } from './InvoiceColumnsSelector';

interface InvoiceTableHeaderProps {
  columns: InvoiceColumn[];
}

const InvoiceTableHeader: React.FC<InvoiceTableHeaderProps> = ({ columns }) => {
  const visibleColumns = columns.filter(col => col.checked);
  
  return (
    <TableHeader>
      <TableRow>
        {visibleColumns.map(column => (
          <TableHead key={column.id} className={column.id === 'amount' ? 'text-right' : ''}>
            {column.label}
          </TableHead>
        ))}
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default InvoiceTableHeader;
