
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Settings2 } from 'lucide-react';
import { ResidentColumn } from '@/pages/Residents';

interface ResidentSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  columns: ResidentColumn[];
  handleColumnToggle: (columnId: string) => void;
}

const ResidentSearch: React.FC<ResidentSearchProps> = ({
  searchTerm,
  setSearchTerm,
  columns,
  handleColumnToggle,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search residents..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 gap-1">
              <Settings2 className="h-4 w-4" />
              <span className="hidden md:inline">Customize Columns</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-2">
              <h4 className="font-medium mb-2">Display Columns</h4>
              <div className="max-h-[300px] overflow-y-auto pr-2">
                {columns.map((column) => (
                  <div key={column.id} className="flex items-center space-x-2 mb-2">
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
              </div>
              <div className="pt-2 text-xs text-muted-foreground">
                At least one column must be selected
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button>Add Resident</Button>
      </div>
    </div>
  );
};

export default ResidentSearch;
