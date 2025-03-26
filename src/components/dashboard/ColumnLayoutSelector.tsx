
import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Grid3X3, LayoutGrid } from 'lucide-react';

interface ColumnLayoutSelectorProps {
  columnCount: number;
  onColumnChange: (columns: number) => void;
}

const ColumnLayoutSelector: React.FC<ColumnLayoutSelectorProps> = ({
  columnCount,
  onColumnChange
}) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <span className="text-sm font-medium">Columns:</span>
      <Toggle 
        pressed={columnCount === 1} 
        onPressedChange={() => onColumnChange(1)}
        aria-label="1 Column"
      >
        <LayoutGrid className="h-4 w-4" />
      </Toggle>
      <Toggle 
        pressed={columnCount === 2} 
        onPressedChange={() => onColumnChange(2)}
        aria-label="2 Columns"
      >
        <Grid3X3 className="h-4 w-4" />
      </Toggle>
    </div>
  );
};

export default ColumnLayoutSelector;
