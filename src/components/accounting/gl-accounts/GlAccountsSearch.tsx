
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface GlAccountsSearchProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
}

const GlAccountsSearch: React.FC<GlAccountsSearchProps> = ({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange
}) => {
  return (
    <div className="flex-1 flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search accounts..." 
          className="pl-8" 
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      <Select defaultValue={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="asset">Asset</SelectItem>
          <SelectItem value="liability">Liability</SelectItem>
          <SelectItem value="equity">Equity</SelectItem>
          <SelectItem value="income">Income</SelectItem>
          <SelectItem value="expense">Expense</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default GlAccountsSearch;
