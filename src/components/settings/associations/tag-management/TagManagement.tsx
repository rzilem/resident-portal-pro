
import React, { useState } from 'react';
import { Tag as TagIcon } from 'lucide-react';
import { Tag, TagType } from '@/types/resident';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import {
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

import TagDialog from './TagDialog';
import TagList from './TagList';
import { 
  RESIDENT_DEFAULT_TAGS, 
  ASSOCIATION_DEFAULT_TAGS, 
  RESIDENT_TAG_TYPES, 
  ASSOCIATION_TAG_TYPES,
  TagFormData
} from './TagManagementUtils';

interface TagManagementProps {
  tagScope?: 'resident' | 'association';
  initialTags?: Tag[];
  onTagsChange?: (tags: Tag[]) => void;
  availableTypes?: Record<string, string>;
}

const TagManagement: React.FC<TagManagementProps> = ({ 
  tagScope = 'association',
  initialTags,
  onTagsChange,
  availableTypes
}) => {
  const isAssociation = tagScope === 'association';
  
  const defaultTags = isAssociation ? ASSOCIATION_DEFAULT_TAGS : RESIDENT_DEFAULT_TAGS;
  const tagTypes = isAssociation ? ASSOCIATION_TAG_TYPES : RESIDENT_TAG_TYPES;
  
  const [tags, setTags] = useState<Tag[]>(initialTags || defaultTags);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  
  // Set default type based on scope
  const defaultType = isAssociation ? ('property' as TagType) : 'custom';
  
  const [newTag, setNewTag] = useState<TagFormData>({
    type: defaultType,
    label: '',
    color: '#71717a'
  });

  const handleAddTag = () => {
    if (!newTag.label) {
      toast.error('Please enter a tag label');
      return;
    }

    // Check if editing existing tag
    if (editingTag) {
      const updatedTags = tags.map(tag => 
        tag.id === editingTag.id 
          ? { ...tag, ...newTag, type: newTag.type as TagType } 
          : tag
      );
      setTags(updatedTags);
      
      if (onTagsChange) {
        onTagsChange(updatedTags);
      }
      
      toast.success('Tag updated successfully');
    } else {
      // Check if tag already exists
      if (tags.some(t => t.label === newTag.label && t.type === newTag.type)) {
        toast.error('This tag already exists');
        return;
      }

      const tagToAdd: Tag = {
        id: uuidv4(),
        type: newTag.type as TagType,
        label: newTag.label || 'New Tag',
        color: newTag.color,
        createdAt: new Date().toISOString()
      };

      const updatedTags = [...tags, tagToAdd];
      setTags(updatedTags);
      
      if (onTagsChange) {
        onTagsChange(updatedTags);
      }
      
      toast.success('Tag added successfully');
    }
    
    setDialogOpen(false);
    resetForm();
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setNewTag({
      type: tag.type,
      label: tag.label,
      color: tag.color
    });
    setDialogOpen(true);
  };

  const handleDeleteTag = (tagId: string) => {
    const updatedTags = tags.filter(tag => tag.id !== tagId);
    setTags(updatedTags);
    
    if (onTagsChange) {
      onTagsChange(updatedTags);
    }
    
    toast.success('Tag deleted');
  };

  const resetForm = () => {
    setEditingTag(null);
    setNewTag({
      type: defaultType,
      label: '',
      color: '#71717a'
    });
  };

  const handleTagDataChange = (data: Partial<TagFormData>) => {
    setNewTag({ ...newTag, ...data });
  };

  const handleCancelDialog = () => {
    setDialogOpen(false);
    resetForm();
  };

  // Group tags by type for display
  const groupedTags = tags.reduce((acc, tag) => {
    if (!acc[tag.type]) {
      acc[tag.type] = [];
    }
    acc[tag.type].push(tag);
    return acc;
  }, {} as Record<string, Tag[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage {isAssociation ? 'Association' : 'Resident'} Tags</CardTitle>
        <CardDescription>
          Create and manage tags that can be applied to {isAssociation ? 'associations' : 'residents'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-6">
          <TagDialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}
            tagData={newTag}
            onTagDataChange={handleTagDataChange}
            onSubmit={handleAddTag}
            onCancel={handleCancelDialog}
            isEditing={!!editingTag}
            tagScope={tagScope}
            availableTypes={availableTypes || tagTypes}
          />
        </div>

        <TagList 
          groupedTags={groupedTags}
          tagTypes={tagTypes}
          onEditTag={handleEditTag}
          onDeleteTag={handleDeleteTag}
        />
      </CardContent>
    </Card>
  );
};

export default TagManagement;
