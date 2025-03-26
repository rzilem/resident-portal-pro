
import React from 'react';
import { Tag } from '@/types/resident';
import TagItem from './TagItem';

interface TagListProps {
  groupedTags: Record<string, Tag[]>;
  tagTypes: Record<string, string>;
  onEditTag: (tag: Tag) => void;
  onDeleteTag: (tagId: string) => void;
}

const TagList: React.FC<TagListProps> = ({ 
  groupedTags, 
  tagTypes, 
  onEditTag, 
  onDeleteTag 
}) => {
  return (
    <div className="space-y-6">
      {Object.entries(groupedTags).map(([type, typeTags]) => (
        <div key={type} className="rounded-lg border p-4">
          <h3 className="text-lg font-medium capitalize mb-4">{tagTypes[type] || type} Tags</h3>
          <div className="flex flex-wrap gap-2">
            {typeTags.map((tag: Tag) => (
              <TagItem 
                key={tag.id} 
                tag={tag} 
                onEdit={onEditTag}
                onDelete={onDeleteTag}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TagList;
