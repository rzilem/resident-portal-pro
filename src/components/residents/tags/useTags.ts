
import { useState, useEffect } from 'react';
import { Tag, TagType } from '@/types/resident';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { PREDEFINED_TAGS, TagFormData } from './TagsConstants';

export interface UseTagsProps {
  initialTags: Tag[];
  onTagsChange?: (tags: Tag[]) => void;
}

export const useTags = ({ initialTags, onTagsChange }: UseTagsProps) => {
  // Ensure initialTags is always an array
  const safeInitialTags = Array.isArray(initialTags) ? initialTags : [];
  
  const [tags, setTags] = useState<Tag[]>(safeInitialTags);
  const [open, setOpen] = useState(false);
  const [usePredefined, setUsePredefined] = useState(true);
  const [selectedPredefinedTag, setSelectedPredefinedTag] = useState<string>('');
  const [newTag, setNewTag] = useState<Partial<TagFormData>>({
    type: 'custom',
    label: '',
    color: '#71717a'
  });

  // Update tags if initialTags changes
  useEffect(() => {
    setTags(Array.isArray(initialTags) ? initialTags : []);
  }, [initialTags]);

  const handleAddTag = () => {
    if (usePredefined && !selectedPredefinedTag) {
      toast.error('Please select a predefined tag');
      return;
    }

    if (!usePredefined && !newTag.label) {
      toast.error('Please enter a tag label');
      return;
    }

    let tagToAdd: Tag;

    if (usePredefined) {
      const [type, ...labelParts] = selectedPredefinedTag.split('-');
      const label = labelParts.join('-');
      const predefined = PREDEFINED_TAGS.find(t => 
        t.type === type && t.label === label
      );
      
      if (!predefined) {
        toast.error('Invalid predefined tag');
        return;
      }
      
      tagToAdd = {
        id: uuidv4(),
        type: predefined.type as TagType,
        label: predefined.label,
        color: predefined.color,
        createdAt: new Date().toISOString()
      };
    } else {
      tagToAdd = {
        id: uuidv4(),
        type: newTag.type as TagType,
        label: newTag.label || 'New Tag',
        color: newTag.color || '#71717a',
        createdAt: new Date().toISOString()
      };
    }

    // Check if tag already exists
    if (tags.some(t => t.label === tagToAdd.label && t.type === tagToAdd.type)) {
      toast.error('This tag already exists');
      return;
    }

    const updatedTags = [...tags, tagToAdd];
    setTags(updatedTags);
    
    if (onTagsChange) {
      onTagsChange(updatedTags);
    }
    
    toast.success('Tag added successfully');
    setOpen(false);
    
    // Reset form
    resetForm();
  };

  const removeTag = (tagId: string) => {
    const updatedTags = tags.filter(tag => tag.id !== tagId);
    setTags(updatedTags);
    if (onTagsChange) {
      onTagsChange(updatedTags);
    }
    toast.success('Tag removed');
  };

  const resetForm = () => {
    setNewTag({
      type: 'custom',
      label: '',
      color: '#71717a'
    });
    setSelectedPredefinedTag('');
    setUsePredefined(true);
  };

  const handleCancel = () => {
    setOpen(false);
    resetForm();
  };

  return {
    tags,
    open,
    setOpen,
    newTag,
    setNewTag,
    usePredefined,
    setUsePredefined,
    selectedPredefinedTag,
    setSelectedPredefinedTag,
    handleAddTag,
    removeTag,
    handleCancel
  };
};
