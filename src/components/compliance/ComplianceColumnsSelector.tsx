
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Columns } from 'lucide-react';

export interface ComplianceColumn {
  id: string;
  label: string;
  checked: boolean;
}

const ComplianceColumnsSelector = () => {
  const [columns, setColumns] = useState<ComplianceColumn[]>([
    { id: 'property', label: 'Property', checked: true },
    { id: 'violation_type', label: 'Violation Type', checked: true },
    { id: 'date_reported', label: 'Date Reported', checked: true },
    { id: 'status', label: 'Status', checked: true },
    { id: 'severity', label: 'Severity', checked: true },
    { id: 'assigned_to', label: 'Assigned To', checked: false },
    { id: 'due_date', label: 'Due Date', checked: false },
    { id: 'created_by', label: 'Created By', checked: false },
    { id: 'description', label: 'Description', checked: false },
  ]);

  const toggleColumn = (id: string) => {
    setColumns(
      columns.map((column) =>
        column.id === id ? { ...column, checked: !column.checked } : column
      )
    );
  };

  // Get visible columns
  const visibleColumns = columns.filter((column) => column.checked);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Columns className="h-3.5 w-3.5" />
          <span className="hidden sm:inline-block">Columns</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.checked}
            onCheckedChange={() => toggleColumn(column.id)}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ComplianceColumnsSelector;
