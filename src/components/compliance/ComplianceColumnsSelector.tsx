
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnsIcon } from 'lucide-react';

// Default columns for the violations table
const availableColumns = [
  { id: 'propertyAddress', label: 'Property Address', default: true },
  { id: 'ownerName', label: 'Owner Name', default: true },
  { id: 'violationType', label: 'Violation Type', default: true },
  { id: 'reportDate', label: 'Report Date', default: true },
  { id: 'status', label: 'Status', default: true },
  { id: 'priority', label: 'Priority', default: true },
  { id: 'dueDate', label: 'Due Date', default: true },
  { id: 'description', label: 'Description', default: false },
  { id: 'assignedTo', label: 'Assigned To', default: false },
  { id: 'lastContactDate', label: 'Last Contact Date', default: false },
  { id: 'fineAmount', label: 'Fine Amount', default: false },
  { id: 'notes', label: 'Notes', default: false },
];

const ComplianceColumnsSelector: React.FC = () => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    availableColumns.filter(col => col.default).map(col => col.id)
  );

  const toggleColumn = (columnId: string) => {
    setSelectedColumns(current => 
      current.includes(columnId)
        ? current.filter(id => id !== columnId)
        : [...current, columnId]
    );
  };

  const resetToDefault = () => {
    setSelectedColumns(availableColumns.filter(col => col.default).map(col => col.id));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <ColumnsIcon className="h-4 w-4" />
          Columns
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-4" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Toggle Columns</h4>
            <p className="text-sm text-muted-foreground">
              Select which columns to display in the table.
            </p>
          </div>
          <div className="grid gap-2">
            {availableColumns.map(column => (
              <div key={column.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`column-${column.id}`}
                  checked={selectedColumns.includes(column.id)}
                  onCheckedChange={() => toggleColumn(column.id)}
                />
                <label 
                  htmlFor={`column-${column.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {column.label}
                </label>
              </div>
            ))}
          </div>
          <Button size="sm" variant="outline" className="w-full" onClick={resetToDefault}>
            Reset to Default
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ComplianceColumnsSelector;
