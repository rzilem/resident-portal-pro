
import React from 'react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ViolationTemplateFilter } from '@/types/compliance';
import { getViolationGroupsByAssociation } from '@/data/violationTemplates';
import { Search } from 'lucide-react';

interface TemplateFiltersProps {
  filters: ViolationTemplateFilter;
  onFilterChange: (filters: ViolationTemplateFilter) => void;
}

const TemplateFilters: React.FC<TemplateFiltersProps> = ({ 
  filters, 
  onFilterChange 
}) => {
  // In a real app, we would fetch these from the API
  const groups = getViolationGroupsByAssociation('1'); // Using a default association for now
  
  const handleFilterChange = (key: keyof ViolationTemplateFilter, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search templates..." 
          className="pl-8"
          value={filters.item || ''}
          onChange={(e) => handleFilterChange('item', e.target.value)}
        />
      </div>
      
      <Select 
        value={filters.group || ''} 
        onValueChange={(value) => handleFilterChange('group', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by group" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Groups</SelectItem>
          {groups.map(group => (
            <SelectItem key={group.id} value={group.name}>
              {group.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select 
        value={filters.description || ''} 
        onValueChange={(value) => handleFilterChange('description', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by description" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Descriptions</SelectItem>
          <SelectItem value="article">Contains Article Reference</SelectItem>
          <SelectItem value="approval">About Approval Process</SelectItem>
          <SelectItem value="prior">Requires Prior Notice</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TemplateFilters;
