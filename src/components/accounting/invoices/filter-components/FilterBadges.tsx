
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { format } from "date-fns";
import { InvoiceFilterState } from '@/components/settings/financial/payment-methods/types';
import { Button } from "@/components/ui/button";

interface FilterBadgesProps {
  filters: InvoiceFilterState;
  onFilterChange: (filters: InvoiceFilterState) => void;
  onDateChange: (field: 'from' | 'to', date: Date | null) => void;
  clearFilters: () => void;
}

const FilterBadges: React.FC<FilterBadgesProps> = ({ 
  filters, 
  onFilterChange, 
  onDateChange, 
  clearFilters 
}) => {
  if (!filters.isFiltered) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-wrap gap-2">
        {filters.query && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Search: {filters.query}
            <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => onFilterChange({ ...filters, query: undefined })} />
          </Badge>
        )}
        
        {filters.dateRange?.from && (
          <Badge variant="secondary" className="flex items-center gap-1">
            From: {format(filters.dateRange.from, 'MMM dd, yyyy')}
            <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => onDateChange('from', null)} />
          </Badge>
        )}
        
        {filters.dateRange?.to && (
          <Badge variant="secondary" className="flex items-center gap-1">
            To: {format(filters.dateRange.to, 'MMM dd, yyyy')}
            <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => onDateChange('to', null)} />
          </Badge>
        )}
        
        {filters.status && filters.status.length > 0 && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Status: {filters.status.join(', ')}
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => onFilterChange({ ...filters, status: undefined })} 
            />
          </Badge>
        )}
        
        {(filters.minAmount !== undefined || filters.maxAmount !== undefined) && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Amount: {filters.minAmount || 0} - {filters.maxAmount || '∞'}
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => onFilterChange({ ...filters, minAmount: undefined, maxAmount: undefined })} 
            />
          </Badge>
        )}
      </div>
      <Button size="sm" variant="ghost" onClick={clearFilters}>Clear all</Button>
    </div>
  );
};

export default FilterBadges;
