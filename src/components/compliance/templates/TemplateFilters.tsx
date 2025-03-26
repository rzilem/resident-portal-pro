
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ViolationTemplateFilter } from '@/types/compliance';

interface TemplateFiltersProps {
  filters: ViolationTemplateFilter;
  onFilterChange: (filters: ViolationTemplateFilter) => void;
}

const TemplateFilters = ({ filters, onFilterChange }: TemplateFiltersProps) => {
  const handleFilterChange = (key: keyof ViolationTemplateFilter, value: string | boolean) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <div className="relative flex-grow">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by item or description..."
          className="pl-9"
          value={filters.item || ''}
          onChange={(e) => handleFilterChange('item', e.target.value)}
        />
      </div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onFilterChange({})}
        className="whitespace-nowrap"
      >
        Clear Filters
      </Button>
    </div>
  );
};

export default TemplateFilters;
