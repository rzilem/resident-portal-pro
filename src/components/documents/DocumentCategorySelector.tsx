
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { FilterIcon, CheckIcon } from 'lucide-react';
import { getDocumentCategories } from '@/utils/documents/documentUtils';
import { cn } from '@/lib/utils';

interface DocumentCategorySelectorProps {
  selectedCategory: string;
  onChange: (category: string) => void;
}

const DocumentCategorySelector: React.FC<DocumentCategorySelectorProps> = ({
  selectedCategory,
  onChange
}) => {
  const categories = [
    { value: 'all', label: 'All Categories' },
    ...getDocumentCategories()
  ];
  
  const getSelectedCategoryLabel = () => {
    const category = categories.find(c => c.value === selectedCategory);
    return category ? category.label : 'All Categories';
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{getSelectedCategoryLabel()}</span>
          <span className="sm:hidden">Filter</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 max-h-[300px] overflow-y-auto">
        {categories.map((category) => (
          <DropdownMenuItem
            key={category.value}
            onClick={() => onChange(category.value)}
            className={cn(
              "flex items-center justify-between",
              selectedCategory === category.value && "font-medium"
            )}
          >
            <span>{category.label}</span>
            {selectedCategory === category.value && (
              <CheckIcon className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DocumentCategorySelector;
