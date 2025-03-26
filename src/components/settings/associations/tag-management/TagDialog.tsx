
import React from 'react';
import { Tag, TagType } from '@/types/resident';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from 'lucide-react';
import { TAG_COLORS, TagFormData } from './TagManagementUtils';

interface TagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tagData: TagFormData;
  onTagDataChange: (data: Partial<TagFormData>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing: boolean;
  tagScope: 'resident' | 'association';
  availableTypes: Record<string, string>;
}

const TagDialog: React.FC<TagDialogProps> = ({
  open,
  onOpenChange,
  tagData,
  onTagDataChange,
  onSubmit,
  onCancel,
  isEditing,
  tagScope,
  availableTypes,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Tag
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Tag' : 'Create New Tag'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? `Update this ${tagScope} tag.` 
              : `Create a new ${tagScope} tag.`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tag-type">Tag Type</Label>
            <Select 
              value={tagData.type as string}
              onValueChange={(value) => onTagDataChange({ type: value as TagType })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a tag type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(availableTypes).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tag-label">Tag Label</Label>
            <Input
              id="tag-label"
              value={tagData.label}
              onChange={(e) => onTagDataChange({ label: e.target.value })}
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
                  onClick={() => onTagDataChange({ color: color.value })}
                  className={`w-6 h-6 rounded-full ${
                    tagData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>
            {isEditing ? 'Save Changes' : 'Add Tag'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TagDialog;
