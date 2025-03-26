
import React, { useState } from 'react';
import { InvoiceFilterState } from '@/components/settings/financial/payment-methods/types';
import SearchForm from './filter-components/SearchForm';
import DateRangePicker from './filter-components/DateRangePicker';
import FilterOptions from './filter-components/FilterOptions';
import FilterBadges from './filter-components/FilterBadges';

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
        <SearchForm 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
        <div className="flex gap-2">
          <DateRangePicker 
            filters={filters} 
            onDateChange={handleDateChange} 
          />
          <FilterOptions 
            filters={filters} 
            onFilterChange={onFilterChange} 
          />
        </div>
      </div>
      
      {filters.isFiltered && (
        <FilterBadges 
          filters={filters}
          onFilterChange={onFilterChange}
          onDateChange={handleDateChange}
          clearFilters={clearFilters}
        />
      )}
    </div>
  );
};

export default InvoiceFilters;
