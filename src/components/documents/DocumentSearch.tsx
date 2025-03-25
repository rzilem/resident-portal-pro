
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdvancedSearchOptions {
  fileTypes: string[];
  dateRange: string;
  tags: string[];
}

interface DocumentSearchProps {
  onSearch: (query: string, options?: AdvancedSearchOptions) => void;
}

const DocumentSearch: React.FC<DocumentSearchProps> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState('all');
  const [tags, setTags] = useState<string[]>([]);

  const handleAdvancedSearch = () => {
    const options: AdvancedSearchOptions = {
      fileTypes,
      dateRange,
      tags
    };
    onSearch(searchValue.trim(), options);
    setShowAdvanced(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue.trim());
  };

  const handleFileTypeToggle = (type: string) => {
    setFileTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleTagToggle = (tag: string) => {
    setTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="w-full max-w-3xl">
      <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
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
        
        <Popover open={showAdvanced} onOpenChange={setShowAdvanced}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Advanced search options">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Advanced Search</h4>
                <p className="text-sm text-muted-foreground">
                  Refine your document search with filters
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>File Types</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="pdf" 
                      checked={fileTypes.includes('pdf')}
                      onCheckedChange={() => handleFileTypeToggle('pdf')}
                    />
                    <Label htmlFor="pdf">PDF</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="docx" 
                      checked={fileTypes.includes('docx')}
                      onCheckedChange={() => handleFileTypeToggle('docx')}
                    />
                    <Label htmlFor="docx">Word</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="xlsx" 
                      checked={fileTypes.includes('xlsx')}
                      onCheckedChange={() => handleFileTypeToggle('xlsx')}
                    />
                    <Label htmlFor="xlsx">Excel</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="img" 
                      checked={fileTypes.includes('img')}
                      onCheckedChange={() => handleFileTypeToggle('img')}
                    />
                    <Label htmlFor="img">Images</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Document Tags</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="financial" 
                      checked={tags.includes('financial')}
                      onCheckedChange={() => handleTagToggle('financial')}
                    />
                    <Label htmlFor="financial">Financial</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="legal" 
                      checked={tags.includes('legal')}
                      onCheckedChange={() => handleTagToggle('legal')}
                    />
                    <Label htmlFor="legal">Legal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="meeting" 
                      checked={tags.includes('meeting')}
                      onCheckedChange={() => handleTagToggle('meeting')}
                    />
                    <Label htmlFor="meeting">Meeting</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="important" 
                      checked={tags.includes('important')}
                      onCheckedChange={() => handleTagToggle('important')}
                    />
                    <Label htmlFor="important">Important</Label>
                  </div>
                </div>
              </div>
              
              <Button onClick={handleAdvancedSearch}>Apply Filters</Button>
            </div>
          </PopoverContent>
        </Popover>
      </form>
    </div>
  );
};

export default DocumentSearch;
