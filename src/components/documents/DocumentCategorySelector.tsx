
import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { FolderIcon } from "lucide-react";

interface DocumentCategorySelectorProps {
  selectedCategory: string;
  onChange: (category: string) => void;
}

const DocumentCategorySelector: React.FC<DocumentCategorySelectorProps> = ({
  selectedCategory,
  onChange
}) => {
  const [categories, setCategories] = useState<string[]>([
    'all',
    'general',
    'financial',
    'legal',
    'meeting',
    'maintenance'
  ]);

  // In a real implementation, you would fetch the categories from the backend
  useEffect(() => {
    // This is just a placeholder for future implementation
    // You could add a call to the backend to fetch the categories
    // For example:
    // const fetchCategories = async () => {
    //   const data = await fetch('/api/document-categories');
    //   const json = await data.json();
    //   setCategories(['all', ...json.categories]);
    // };
    // fetchCategories();
  }, []);

  return (
    <div className="flex items-center gap-2">
      <FolderIcon className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedCategory} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category} className="capitalize">
              {category === 'all' ? 'All Categories' : category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DocumentCategorySelector;
