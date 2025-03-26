
import React from 'react';
import { Plus } from 'lucide-react';
import { Tag } from '@/types/resident';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import TagBadge from './tags/TagBadge';
import TagDialog from './tags/TagDialog';
import { useTags } from './tags/useTags';

interface ResidentTagsProps {
  tags?: Tag[];
  onTagsChange?: (tags: Tag[]) => void;
  editable?: boolean;
}

const ResidentTags: React.FC<ResidentTagsProps> = ({ 
  tags = [], 
  onTagsChange,
  editable = true 
}) => {
  // Ensure we're working with an array, even if tags is undefined
  const safeInitialTags = Array.isArray(tags) ? tags : [];
  
  const {
    tags: currentTags,
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
  } = useTags({ 
    initialTags: safeInitialTags, 
    onTagsChange 
  });

  // Debug - log the processed tags
  console.log('Tags in ResidentTags component:', currentTags);

  return (
    <div>
      <div className="flex flex-wrap gap-2 items-center">
        {currentTags.map(tag => (
          <TagBadge 
            key={tag.id}
            tag={tag}
            editable={editable}
            onRemove={removeTag}
          />
        ))}
        
        {editable && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 h-7"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Tag
              </Button>
            </DialogTrigger>
            
            <TagDialog
              open={open}
              onOpenChange={setOpen}
              onAddTag={handleAddTag}
              onCancel={handleCancel}
              usePredefined={usePredefined}
              setUsePredefined={setUsePredefined}
              selectedPredefinedTag={selectedPredefinedTag}
              setSelectedPredefinedTag={setSelectedPredefinedTag}
              newTag={newTag}
              setNewTag={setNewTag}
            />
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ResidentTags;
