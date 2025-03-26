
import React, { useState } from 'react';
import { Tag as TagIcon, Plus, X } from 'lucide-react';
import { Tag } from '@/types/resident';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { v4 as uuidv4 } from 'uuid';
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';

interface ResidentTagsProps {
  tags?: Tag[];
  onTagsChange?: (tags: Tag[]) => void;
  editable?: boolean;
}

const TAG_COLORS = [
  { label: 'Gray', value: '#71717a' }, // zinc-500
  { label: 'Red', value: '#dc2626' },  // red-600
  { label: 'Orange', value: '#ea580c' }, // orange-600
  { label: 'Amber', value: '#d97706' }, // amber-600 
  { label: 'Yellow', value: '#ca8a04' }, // yellow-600
  { label: 'Lime', value: '#65a30d' },  // lime-600
  { label: 'Green', value: '#16a34a' }, // green-600
  { label: 'Teal', value: '#0d9488' },  // teal-600
  { label: 'Sky', value: '#0ea5e9' },   // sky-500
  { label: 'Blue', value: '#2563eb' },  // blue-600
  { label: 'Indigo', value: '#4f46e5' }, // indigo-600
  { label: 'Violet', value: '#7c3aed' }, // violet-600
  { label: 'Purple', value: '#9333ea' }, // purple-600
  { label: 'Fuchsia', value: '#c026d3' }, // fuchsia-600
  { label: 'Pink', value: '#db2777' },   // pink-600
  { label: 'Rose', value: '#e11d48' },   // rose-600
];

const PREDEFINED_TAGS = [
  { type: 'board', label: 'Board Member', color: '#0ea5e9' },
  { type: 'board', label: 'President', color: '#0ea5e9' },
  { type: 'board', label: 'Vice President', color: '#0ea5e9' },
  { type: 'board', label: 'Secretary', color: '#0ea5e9' },
  { type: 'board', label: 'Treasurer', color: '#0ea5e9' },
  { type: 'committee', label: 'Architectural Committee', color: '#16a34a' },
  { type: 'committee', label: 'Landscaping Committee', color: '#65a30d' },
  { type: 'committee', label: 'Social Committee', color: '#9333ea' },
  { type: 'committee', label: 'Finance Committee', color: '#0d9488' },
  { type: 'delinquent', label: 'Delinquent', color: '#dc2626' },
  { type: 'delinquent', label: '30+ Days Past Due', color: '#ea580c' },
  { type: 'delinquent', label: '60+ Days Past Due', color: '#e11d48' },
  { type: 'delinquent', label: '90+ Days Past Due', color: '#be123c' },
];

const ResidentTags: React.FC<ResidentTagsProps> = ({ 
  tags = [], 
  onTagsChange,
  editable = true 
}) => {
  const [open, setOpen] = useState(false);
  const [newTag, setNewTag] = useState<Partial<Tag>>({
    type: 'custom',
    label: '',
    color: '#71717a'
  });
  const [usePredefined, setUsePredefined] = useState(true);
  const [selectedPredefinedTag, setSelectedPredefinedTag] = useState<string>('');

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
      const predefined = PREDEFINED_TAGS.find(t => 
        `${t.type}-${t.label}` === selectedPredefinedTag
      );
      
      if (!predefined) {
        toast.error('Invalid predefined tag');
        return;
      }
      
      tagToAdd = {
        id: uuidv4(),
        type: predefined.type as 'board' | 'committee' | 'delinquent' | 'custom',
        label: predefined.label,
        color: predefined.color,
        createdAt: new Date().toISOString()
      };
    } else {
      tagToAdd = {
        id: uuidv4(),
        type: newTag.type as 'board' | 'committee' | 'delinquent' | 'custom',
        label: newTag.label || 'New Tag',
        color: newTag.color,
        createdAt: new Date().toISOString()
      };
    }

    // Check if tag already exists
    if (tags.some(t => t.label === tagToAdd.label && t.type === tagToAdd.type)) {
      toast.error('This tag already exists');
      return;
    }

    const updatedTags = [...tags, tagToAdd];
    if (onTagsChange) {
      onTagsChange(updatedTags);
    }
    
    toast.success('Tag added successfully');
    setOpen(false);
    
    // Reset form
    setNewTag({
      type: 'custom',
      label: '',
      color: '#71717a'
    });
    setSelectedPredefinedTag('');
  };

  const removeTag = (tagId: string) => {
    const updatedTags = tags.filter(tag => tag.id !== tagId);
    if (onTagsChange) {
      onTagsChange(updatedTags);
    }
    toast.success('Tag removed');
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 items-center">
        {tags.map(tag => (
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
            {editable && (
              <button 
                className="ml-1 hover:bg-gray-200 rounded-full"
                onClick={() => removeTag(tag.id)}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
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
                        <SelectItem value="">Select a tag</SelectItem>
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
                        value={newTag.type}
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
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTag}>
                  Add Tag
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ResidentTags;
