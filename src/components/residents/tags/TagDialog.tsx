import React from 'react';
import { Tag, TagType } from '@/types/resident';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { TAG_COLORS, PREDEFINED_TAGS, TagFormData } from './TagsConstants';

interface TagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTag: () => void;
  onCancel: () => void;
  usePredefined: boolean;
  setUsePredefined: (value: boolean) => void;
  selectedPredefinedTag: string;
  setSelectedPredefinedTag: (value: string) => void;
  newTag: Partial<TagFormData>;
  setNewTag: (value: Partial<TagFormData>) => void;
}

const TagDialog: React.FC<TagDialogProps> = ({
  onAddTag,
  onCancel,
  usePredefined,
  setUsePredefined,
  selectedPredefinedTag,
  setSelectedPredefinedTag,
  newTag,
  setNewTag,
}) => {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add Tag</DialogTitle>
        <DialogDescription>
          Add a predefined tag or create a custom tag for this resident.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="use-predefined" 
            checked={usePredefined}
            onCheckedChange={(checked) => {
              setUsePredefined(checked as boolean);
            }}
          />
          <Label htmlFor="use-predefined">Use predefined tag</Label>
        </div>
        
        {usePredefined ? (
          <div className="space-y-2">
            <Label htmlFor="predefined-tag">Predefined Tag</Label>
            <Select 
              value={selectedPredefinedTag}
              onValueChange={setSelectedPredefinedTag}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a predefined tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select_tag">Select a tag</SelectItem>
                {PREDEFINED_TAGS.map((tag, index) => (
                  <SelectItem 
                    key={index} 
                    value={`${tag.type}-${tag.label}`}
                    className="flex items-center"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: tag.color }}
                      />
                      <span>{tag.label}</span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({tag.type})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tag-type">Tag Type</Label>
              <Select 
                value={newTag.type as string}
                onValueChange={(value) => setNewTag({ ...newTag, type: value as TagType })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a tag type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="board">Board</SelectItem>
                  <SelectItem value="committee">Committee</SelectItem>
                  <SelectItem value="delinquent">Delinquent</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tag-label">Tag Label</Label>
              <Input
                id="tag-label"
                value={newTag.label}
                onChange={(e) => setNewTag({ ...newTag, label: e.target.value })}
                placeholder="Enter tag label"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tag-color">Tag Color</Label>
              <div className="grid grid-cols-8 gap-2">
                {TAG_COLORS.map((color, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setNewTag({ ...newTag, color: color.value })}
                    className={`w-6 h-6 rounded-full ${
                      newTag.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onAddTag}>
          Add Tag
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default TagDialog;
