
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { PlusCircle, Search } from "lucide-react";
import { LeadColumn } from './LeadColumnsSelector';
import LeadColumnsSelector from './LeadColumnsSelector';
import { LeadTableFilters } from './types';

interface LeadTableToolbarProps {
  filters: LeadTableFilters;
  onFilterChange: (filters: Partial<LeadTableFilters>) => void;
  columns: LeadColumn[];
  onColumnsChange: (columns: LeadColumn[]) => void;
}

const LeadTableToolbar: React.FC<LeadTableToolbarProps> = ({
  filters,
  onFilterChange,
  columns,
  onColumnsChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      <div className="flex flex-1 gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            className="pl-8"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
          />
        </div>
        
        <Select 
          value={filters.statusFilter} 
          onValueChange={(value) => onFilterChange({ statusFilter: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="proposal">Proposal</SelectItem>
            <SelectItem value="negotiation">Negotiation</SelectItem>
            <SelectItem value="closed-won">Closed (Won)</SelectItem>
            <SelectItem value="closed-lost">Closed (Lost)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2">
        <LeadColumnsSelector 
          columns={columns} 
          onChange={onColumnsChange} 
        />
        
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>
    </div>
  );
};

export default LeadTableToolbar;
