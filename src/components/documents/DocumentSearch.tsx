
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon,
  X,
  Tag
} from 'lucide-react';
import { DocumentSearchFilters } from '@/types/documents';
import { format } from 'date-fns';

interface DocumentSearchProps {
  onSearch: (query: string) => void;
  onAdvancedSearch?: (filters: DocumentSearchFilters) => void;
}

const DocumentSearch: React.FC<DocumentSearchProps> = ({ 
  onSearch,
  onAdvancedSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<DocumentSearchFilters>({
    query: '',
    categories: [],
    fileTypes: [],
    dateRange: undefined,
    tags: []
  });
  
  // Common file type options
  const fileTypeOptions = [
    { label: 'PDF Documents', value: 'pdf' },
    { label: 'Word Documents', value: 'docx' },
    { label: 'Excel Spreadsheets', value: 'xlsx' },
    { label: 'Images', value: 'image' }
  ];
  
  // Common category options
  const categoryOptions = [
    { label: 'Governing Documents', value: 'governing' },
    { label: 'Financial Documents', value: 'financial' },
    { label: 'Meeting Documents', value: 'meetings' },
    { label: 'Legal Documents', value: 'legal' },
    { label: 'Rules & Regulations', value: 'rules' },
    { label: 'Contracts', value: 'contracts' }
  ];
  
  // Common tag options
  const tagOptions = [
    'important',
    'board',
    'residents',
    'budget',
    'maintenance',
    'legal',
    'vendor'
  ];
  
  const handleSimpleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  const handleAdvancedSearch = () => {
    if (onAdvancedSearch) {
      onAdvancedSearch(advancedFilters);
    }
    setShowAdvancedSearch(false);
  };
  
  const handleDateRangeChange = (dateType: 'start' | 'end', date: Date | undefined) => {
    setAdvancedFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [dateType]: date ? date.toISOString() : undefined
      }
    }));
  };
  
  const toggleCategory = (category: string) => {
    setAdvancedFilters(prev => {
      const categories = prev.categories || [];
      if (categories.includes(category)) {
        return {
          ...prev,
          categories: categories.filter(c => c !== category)
        };
      } else {
        return {
          ...prev,
          categories: [...categories, category]
        };
      }
    });
  };
  
  const toggleFileType = (fileType: string) => {
    setAdvancedFilters(prev => {
      const fileTypes = prev.fileTypes || [];
      if (fileTypes.includes(fileType)) {
        return {
          ...prev,
          fileTypes: fileTypes.filter(t => t !== fileType)
        };
      } else {
        return {
          ...prev,
          fileTypes: [...fileTypes, fileType]
        };
      }
    });
  };
  
  const toggleTag = (tag: string) => {
    setAdvancedFilters(prev => {
      const tags = prev.tags || [];
      if (tags.includes(tag)) {
        return {
          ...prev,
          tags: tags.filter(t => t !== tag)
        };
      } else {
        return {
          ...prev,
          tags: [...tags, tag]
        };
      }
    });
  };
  
  const resetAdvancedFilters = () => {
    setAdvancedFilters({
      query: '',
      categories: [],
      fileTypes: [],
      dateRange: undefined,
      tags: []
    });
  };
  
  return (
    <>
      <form onSubmit={handleSimpleSearch} className="flex w-full max-w-md items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button type="submit">Search</Button>
        <Button 
          type="button" 
          variant="outline" 
          size="icon"
          onClick={() => setShowAdvancedSearch(true)}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </form>
      
      <Dialog open={showAdvancedSearch} onOpenChange={setShowAdvancedSearch}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Advanced Document Search
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="advanced-query">Search Text</Label>
              <Input
                id="advanced-query"
                placeholder="Enter keywords to search for..."
                value={advancedFilters.query}
                onChange={(e) => setAdvancedFilters(prev => ({ ...prev, query: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Document Categories</Label>
                  <div className="space-y-2">
                    {categoryOptions.map(option => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${option.value}`}
                          checked={advancedFilters.categories?.includes(option.value) || false}
                          onCheckedChange={() => toggleCategory(option.value)}
                        />
                        <label
                          htmlFor={`category-${option.value}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">File Types</Label>
                  <div className="space-y-2">
                    {fileTypeOptions.map(option => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`filetype-${option.value}`}
                          checked={advancedFilters.fileTypes?.includes(option.value) || false}
                          onCheckedChange={() => toggleFileType(option.value)}
                        />
                        <label
                          htmlFor={`filetype-${option.value}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Date Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">From</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {advancedFilters.dateRange?.start
                              ? format(new Date(advancedFilters.dateRange.start), 'PPP')
                              : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={advancedFilters.dateRange?.start ? new Date(advancedFilters.dateRange.start) : undefined}
                            onSelect={(date) => handleDateRangeChange('start', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">To</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {advancedFilters.dateRange?.end
                              ? format(new Date(advancedFilters.dateRange.end), 'PPP')
                              : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={advancedFilters.dateRange?.end ? new Date(advancedFilters.dateRange.end) : undefined}
                            onSelect={(date) => handleDateRangeChange('end', date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {tagOptions.map(tag => {
                      const isSelected = advancedFilters.tags?.includes(tag) || false;
                      return (
                        <Badge
                          key={tag}
                          variant={isSelected ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleTag(tag)}
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                          {isSelected && (
                            <X className="h-3 w-3 ml-1" />
                          )}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="ghost"
              onClick={resetAdvancedFilters}
            >
              Reset Filters
            </Button>
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setShowAdvancedSearch(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={handleAdvancedSearch}
              >
                Apply Filters
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentSearch;
