
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tag } from '@/types/resident';

interface TagItemProps {
  tag: Tag;
  onEdit: (tag: Tag) => void;
  onDelete: (tagId: string) => void;
}

const TagItem: React.FC<TagItemProps> = ({ tag, onEdit, onDelete }) => {
  return (
    <div 
      key={tag.id}
      className="relative group flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-gray-50"
    >
      <div 
        className="w-3 h-3 rounded-full" 
        style={{ backgroundColor: tag.color }}
      />
      <span>{tag.label}</span>
      
      <div className="absolute right-2 flex opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7" 
          onClick={() => onEdit(tag)}
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 text-destructive hover:text-destructive" 
          onClick={() => onDelete(tag.id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  );
};

export default TagItem;
