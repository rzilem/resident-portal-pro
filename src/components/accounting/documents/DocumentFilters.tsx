
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DocumentFiltersProps {
  onSearchChange?: (value: string) => void;
  onTagFilterChange?: (value: string) => void;
}

const DocumentFilters: React.FC<DocumentFiltersProps> = ({ 
  onSearchChange, 
  onTagFilterChange 
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
      <div className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            placeholder="Search documents..." 
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 pl-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="shrink-0">
          <Filter size={16} />
        </Button>
      </div>
      <div className="flex gap-2">
        <Select defaultValue="all" onValueChange={onTagFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="vendor">Vendor</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="bank">Bank</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DocumentFilters;
