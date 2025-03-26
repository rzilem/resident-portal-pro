
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Filter, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { InvoiceFilterState } from '@/components/settings/financial/payment-methods/types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface InvoiceFiltersProps {
  filters: InvoiceFilterState;
  onFilterChange: (filters: InvoiceFilterState) => void;
}

const InvoiceFilters: React.FC<InvoiceFiltersProps> = ({ filters, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState(filters.query || '');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filters, query: searchQuery });
  };
  
  const handleDateChange = (field: 'from' | 'to', date: Date | null) => {
    onFilterChange({
      ...filters,
      dateRange: {
        ...filters.dateRange || { from: null, to: null },
        [field]: date
      },
      isFiltered: true
    });
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    onFilterChange({
      query: '',
      isFiltered: false
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <form className="flex-1 flex gap-2" onSubmit={handleSearch}>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by invoice #, recipient..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" variant="default" size="icon" className="shrink-0">
            <Search size={16} />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Calendar size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-3">
                <h4 className="font-medium mb-2">Date Range</h4>
                <div className="grid gap-2">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">From</div>
                    <CalendarComponent
                      mode="single"
                      selected={filters.dateRange?.from || undefined}
                      onSelect={(date) => handleDateChange('from', date)}
                      initialFocus
                    />
                  </div>
                  <Separator />
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">To</div>
                    <CalendarComponent
                      mode="single"
                      selected={filters.dateRange?.to || undefined}
                      onSelect={(date) => handleDateChange('to', date)}
                      initialFocus
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
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
        </form>
      </div>
      
      {filters.isFiltered && (
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
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleDateChange('from', null)} />
              </Badge>
            )}
            
            {filters.dateRange?.to && (
              <Badge variant="secondary" className="flex items-center gap-1">
                To: {format(filters.dateRange.to, 'MMM dd, yyyy')}
                <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleDateChange('to', null)} />
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
      )}
    </div>
  );
};

export default InvoiceFilters;
