
import React from 'react';
import { cn } from '@/lib/utils';
import { Pencil, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentCategory } from '@/types/documents';
import { getFolderIconColorByAccessLevel } from '@/components/documents/utils/categoryUtils';

interface CategoryItemProps {
  category: DocumentCategory;
  activeCategory: string;
  hasAccess: boolean;
  editMode: boolean;
  onSelect: (categoryId: string) => void;
  onEditStart: (category: DocumentCategory) => void;
}

const CategoryItem = ({ 
  category, 
  activeCategory, 
  hasAccess, 
  editMode, 
  onSelect, 
  onEditStart 
}: CategoryItemProps) => {
  // Handler for selecting a category
  const handleSelect = () => {
    if (!editMode && hasAccess) {
      onSelect(category.id);
    }
  };

  // Handler for starting to edit a category
  const handleEditStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditStart(category);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between px-3 py-2 text-sm rounded-md",
        !hasAccess && "opacity-50 cursor-not-allowed",
        category.id === activeCategory ? "bg-muted font-medium" : "hover:bg-muted/50",
        editMode ? "cursor-default" : hasAccess ? "cursor-pointer" : "cursor-not-allowed"
      )}
      onClick={handleSelect}
    >
      <div className="flex items-center gap-2 truncate">
        {getFolderIconColorByAccessLevel(category.accessLevel || 'all')}
        <span className="truncate">{category.name}</span>
      </div>
      
      {!hasAccess && (
        <div className="text-muted-foreground flex items-center text-xs gap-0.5">
          <ShieldAlert className="h-3 w-3" />
          <span className="sr-only">Restricted</span>
        </div>
      )}
      
      {editMode && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={handleEditStart}
        >
          <Pencil className="h-3 w-3" />
          <span className="sr-only">Edit Category</span>
        </Button>
      )}
    </div>
  );
};

export default CategoryItem;
