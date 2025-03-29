
import React from 'react';
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, RefreshCw, Tag, Calendar, Clock } from "lucide-react";

interface DocumentTableFiltersProps {
  localSearchQuery: string;
  setLocalSearchQuery: (query: string) => void;
  tagFilter: string;
  setTagFilter: (tag: string) => void;
  dateFilter: string;
  setDateFilter: (filter: string) => void;
  sortOrder: 'name' | 'date' | 'size';
  setSortOrder: (order: 'name' | 'date' | 'size') => void;
  refreshDocuments: () => void;
}

const DocumentTableFilters: React.FC<DocumentTableFiltersProps> = ({
  localSearchQuery,
  setLocalSearchQuery,
  tagFilter,
  setTagFilter,
  dateFilter,
  setDateFilter,
  sortOrder,
  setSortOrder,
  refreshDocuments
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Filter documents..."
          className="pl-9 w-full max-w-xs"
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={refreshDocuments} title="Refresh documents">
          <RefreshCw className="h-4 w-4" />
        </Button>
        
        <Select value={tagFilter} onValueChange={setTagFilter}>
          <SelectTrigger className="w-[160px]">
            <Tag className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_tags">All Tags</SelectItem>
            <SelectItem value="budget">Budget</SelectItem>
            <SelectItem value="legal">Legal</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem>
            <SelectItem value="rules">Rules</SelectItem>
            <SelectItem value="important">Important</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[160px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Date uploaded" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_time">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
          <SelectTrigger className="w-[160px]">
            <Clock className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Most Recent</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="size">Size (Largest)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DocumentTableFilters;
