
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Filter, Search, RefreshCw } from 'lucide-react';
import { DatabaseColumnsSelector, DatabaseColumn } from '../DatabaseColumnsSelector';

interface HomeownerFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  columns: DatabaseColumn[];
  handleColumnsChange: (columns: DatabaseColumn[]) => void;
}

const HomeownerFilters: React.FC<HomeownerFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  columns,
  handleColumnsChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search homeowners..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <DatabaseColumnsSelector 
          columns={columns}
          onChange={handleColumnsChange}
          type="homeowner"
        />
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default HomeownerFilters;
