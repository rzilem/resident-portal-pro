import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCategories } from '@/utils/documents/documentDbUtils';

const DocumentCategorySelector = ({ selectedCategory, onChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        
        for (const category of categoriesData) {
          
        }
      } catch (error) {
        console.error("Error fetching document categories:", error);
      }
    };
    
    fetchCategories();
  }, []);

  return (
    <Select value={selectedCategory} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DocumentCategorySelector;
