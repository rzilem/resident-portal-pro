
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings2 } from 'lucide-react';
import { useSettings } from '@/hooks/use-settings';

export type VendorColumn = {
  id: string;
  label: string;
  checked: boolean;
}

export interface VendorColumnsSelectorProps {
  columns: VendorColumn[];
  onChange: (columns: VendorColumn[]) => void;
}

export const VendorColumnsSelector = ({ columns, onChange }: VendorColumnsSelectorProps) => {
  const [selectedColumns, setSelectedColumns] = useState<VendorColumn[]>(columns);
  const { updatePreference } = useSettings();

  const handleColumnToggle = (columnId: string) => {
    const updatedColumns = selectedColumns.map(column => 
      column.id === columnId ? { ...column, checked: !column.checked } : column
    );
    
    const hasCheckedColumn = updatedColumns.some(col => col.checked);
    
    if (hasCheckedColumn) {
      setSelectedColumns(updatedColumns);
      onChange(updatedColumns);
      
      // Save to user preferences
      updatePreference('vendorTableColumns', updatedColumns);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Settings2 className="h-4 w-4" />
          <span className="hidden md:inline">Customize Columns</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <h4 className="font-medium mb-2">Display Columns</h4>
          {selectedColumns.map((column) => (
            <div key={column.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`column-${column.id}`} 
                checked={column.checked} 
                onCheckedChange={() => handleColumnToggle(column.id)}
              />
              <label
                htmlFor={`column-${column.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {column.label}
              </label>
            </div>
          ))}
          <div className="pt-2 text-xs text-muted-foreground">
            At least one column must be selected
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default VendorColumnsSelector;
