
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search, Calendar, Filter } from "lucide-react";

const InvoiceFilters: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
      <div className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input 
            placeholder="Search by invoice #, recipient..." 
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 pl-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <Button variant="outline" size="icon" className="shrink-0">
          <Calendar size={16} />
        </Button>
        <Button variant="outline" size="icon" className="shrink-0">
          <Filter size={16} />
        </Button>
      </div>
    </div>
  );
};

export default InvoiceFilters;
