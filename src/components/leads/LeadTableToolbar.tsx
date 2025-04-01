
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search, Plus } from "lucide-react";
import LeadColumnsSelector from './LeadColumnsSelector';
import { LeadColumn } from './LeadColumnsSelector';
import { LeadTableFilters } from './types';
import LeadFormDialog from './LeadFormDialog';

interface LeadTableToolbarProps {
  filters: LeadTableFilters;
  onFilterChange: (filters: Partial<LeadTableFilters>) => void;
  columns: LeadColumn[];
  onColumnsChange: (columns: LeadColumn[]) => void;
  onRefresh: () => void;
}

const LeadTableToolbar: React.FC<LeadTableToolbarProps> = ({
  filters,
  onFilterChange,
  columns,
  onColumnsChange,
  onRefresh
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };
  
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ statusFilter: e.target.value });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search leads..."
              value={filters.search}
              onChange={handleSearchChange}
              className="pl-8 w-full md:w-64"
            />
          </div>

          <select 
            className="border rounded-md p-2 text-sm"
            value={filters.statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="closed-won">Won</option>
            <option value="closed-lost">Lost</option>
          </select>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <LeadFormDialog buttonText="Add Lead" buttonVariant="default" />
          
          <LeadColumnsSelector 
            columns={columns} 
            onColumnsChange={onColumnsChange} 
          />
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeadTableToolbar;
