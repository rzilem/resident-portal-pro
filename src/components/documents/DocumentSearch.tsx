
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface DocumentSearchProps {
  onSearch: (query: string) => void;
}

const DocumentSearch: React.FC<DocumentSearchProps> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue.trim());
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search documents..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-8"
        />
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
};

export default DocumentSearch;
