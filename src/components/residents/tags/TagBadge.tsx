
import React from 'react';
import { Tag as TagIcon, X } from 'lucide-react';
import { Tag } from '@/types/resident';
import { Badge } from '@/components/ui/badge';

interface TagBadgeProps {
  tag: Tag;
  editable?: boolean;
  onRemove?: (tagId: string) => void;
}

const TagBadge: React.FC<TagBadgeProps> = ({ tag, editable = false, onRemove }) => {
  // Debug - log each tag that's being rendered
  console.log('Rendering tag:', tag);
  
  return (
    <Badge 
      key={tag.id}
      variant="outline"
      className="flex items-center gap-1.5 px-2 py-1"
      style={{ 
        backgroundColor: `${tag.color}10`, // 10% opacity
        borderColor: tag.color,
        color: tag.color 
      }}
    >
      <TagIcon className="h-3 w-3" />
      {tag.label}
      {editable && onRemove && (
        <button 
          className="ml-1 hover:bg-gray-200 rounded-full"
          onClick={() => onRemove(tag.id)}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
};

export default TagBadge;
