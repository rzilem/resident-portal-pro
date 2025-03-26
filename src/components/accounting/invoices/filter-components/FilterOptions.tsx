
import React from 'react';
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Badge } from '@/components/ui/badge';
import { InvoiceFilterState } from '@/components/settings/financial/payment-methods/types';

interface FilterOptionsProps {
  filters: InvoiceFilterState;
  onFilterChange: (filters: InvoiceFilterState) => void;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({ filters, onFilterChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0">
          <Filter size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="space-y-4">
          <h4 className="font-medium">Filter Invoices</h4>
          <div>
            <h5 className="text-sm font-medium mb-1">Invoice Status</h5>
            <div className="flex flex-wrap gap-2">
              {['draft', 'sent', 'paid', 'overdue'].map(status => (
                <Badge 
                  key={status}
                  variant={filters.status?.includes(status) ? 'default' : 'outline'}
                  className="cursor-pointer capitalize"
                  onClick={() => {
                    const newStatus = filters.status || [];
                    const updated = newStatus.includes(status)
                      ? newStatus.filter(s => s !== status)
                      : [...newStatus, status];
                    
                    onFilterChange({
                      ...filters,
                      status: updated,
                      isFiltered: true
                    });
                  }}
                >
                  {status}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="text-sm font-medium mb-1">Amount Range</h5>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="number"
                  placeholder="Min $"
                  value={filters.minAmount || ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : undefined;
                    onFilterChange({
                      ...filters,
                      minAmount: value,
                      isFiltered: true
                    });
                  }}
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Max $"
                  value={filters.maxAmount || ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : undefined;
                    onFilterChange({
                      ...filters,
                      maxAmount: value,
                      isFiltered: true
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterOptions;
