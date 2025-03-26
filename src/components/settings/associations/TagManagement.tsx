
import React, { useState } from 'react';
import { Tag as TagIcon, Plus, Edit, Trash2 } from 'lucide-react';
import { Tag } from '@/types/resident';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Color options for tags
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

// Mock data for association tags
const DEFAULT_TAGS: Tag[] = [
  {
    id: uuidv4(),
    type: 'board',
    label: 'Board Member',
    color: '#0ea5e9',
    createdAt: '2023-01-01'
  },
  {
    id: uuidv4(),
    type: 'board',
    label: 'President',
    color: '#0ea5e9',
    createdAt: '2023-01-01'
  },
  {
    id: uuidv4(),
    type: 'board',
    label: 'Treasurer',
    color: '#0ea5e9',
    createdAt: '2023-01-01'
  },
  {
    id: uuidv4(),
    type: 'committee',
    label: 'Architectural Committee',
    color: '#16a34a',
    createdAt: '2023-01-01'
  },
  {
    id: uuidv4(),
    type: 'committee',
    label: 'Landscaping Committee',
    color: '#65a30d',
    createdAt: '2023-01-01'
  },
  {
    id: uuidv4(),
    type: 'delinquent',
    label: 'Delinquent',
    color: '#dc2626',
    createdAt: '2023-01-01'
  },
  {
    id: uuidv4(),
    type: 'delinquent',
    label: '30+ Days Past Due',
    color: '#ea580c',
    createdAt: '2023-01-01'
  },
  {
    id: uuidv4(),
    type: 'custom',
    label: 'New Resident',
    color: '#7c3aed',
    createdAt: '2023-02-15'
  }
];

const TagManagement: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>(DEFAULT_TAGS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTag, setNewTag] = useState<Partial<Tag>>({
    type: 'custom',
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
      toast.success('Tag updated successfully');
    } else {
      // Check if tag already exists
      if (tags.some(t => t.label === newTag.label && t.type === newTag.type)) {
        toast.error('This tag already exists');
        return;
      }

      const tagToAdd: Tag = {
        id: uuidv4(),
        type: newTag.type as 'board' | 'committee' | 'delinquent' | 'custom',
        label: newTag.label || 'New Tag',
        color: newTag.color,
        createdAt: new Date().toISOString()
      };

      setTags([...tags, tagToAdd]);
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
    setTags(tags.filter(tag => tag.id !== tagId));
    toast.success('Tag deleted');
  };

  const resetForm = () => {
    setEditingTag(null);
    setNewTag({
      type: 'custom',
      label: '',
      color: '#71717a'
    });
  };

  const groupedTags = tags.reduce((acc, tag) => {
    if (!acc[tag.type]) {
      acc[tag.type] = [];
    }
    acc[tag.type].push(tag);
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Resident Tags</CardTitle>
        <CardDescription>
          Create and manage tags that can be assigned to residents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-6">
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Tag
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingTag ? 'Edit Tag' : 'Create New Tag'}
                </DialogTitle>
                <DialogDescription>
                  {editingTag 
                    ? 'Update this tag for your association.' 
                    : 'Create a new tag for your association.'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="tag-type">Tag Type</Label>
                  <Select 
                    value={newTag.type}
                    onValueChange={(value) => setNewTag({ ...newTag, type: value })}
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
              
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button onClick={handleAddTag}>
                  {editingTag ? 'Save Changes' : 'Add Tag'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedTags).map(([type, typeTags]) => (
            <div key={type} className="rounded-lg border p-4">
              <h3 className="text-lg font-medium capitalize mb-4">{type} Tags</h3>
              <div className="flex flex-wrap gap-2">
                {typeTags.map((tag: Tag) => (
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
                        onClick={() => handleEditTag(tag)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-destructive hover:text-destructive" 
                        onClick={() => handleDeleteTag(tag.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TagManagement;
