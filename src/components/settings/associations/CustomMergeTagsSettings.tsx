
import React, { useState, useEffect } from 'react';
import { useAssociations } from '@/hooks/use-associations';
import { mergeTagService } from '@/services/mergeTagService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Tag, Plus, Pencil, Trash2 } from 'lucide-react';
import { MergeTag, MergeTagCategory, CustomMergeTagDefinition } from '@/types/mergeTags';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const mergeTagSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  tag: z.string().min(1, 'Tag is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  defaultValue: z.string().optional(),
});

type MergeTagFormValues = z.infer<typeof mergeTagSchema>;

const CustomMergeTagsSettings = () => {
  const { activeAssociation } = useAssociations();
  const [customTags, setCustomTags] = useState<MergeTag[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

  const form = useForm<MergeTagFormValues>({
    resolver: zodResolver(mergeTagSchema),
    defaultValues: {
      name: '',
      tag: '',
      description: '',
      category: 'custom',
      defaultValue: '',
    },
  });

  const categoryOptions: { value: MergeTagCategory; label: string }[] = [
    { value: 'association', label: 'Association' },
    { value: 'property', label: 'Property' },
    { value: 'resident', label: 'Resident' },
    { value: 'financial', label: 'Financial' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'communication', label: 'Communication' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'workflow', label: 'Workflow' },
    { value: 'board', label: 'Board' },
    { value: 'event', label: 'Event' },
    { value: 'violation', label: 'Violation' },
    { value: 'custom', label: 'Custom' },
  ];

  useEffect(() => {
    const loadCustomTags = async () => {
      if (activeAssociation) {
        const tags = await mergeTagService.getCustomMergeTagsForAssociation(activeAssociation.id);
        setCustomTags(tags);
      }
    };

    loadCustomTags();
  }, [activeAssociation]);

  const handleAddTag = () => {
    setIsEditMode(false);
    setSelectedTagId(null);
    form.reset({
      name: '',
      tag: '',
      description: '',
      category: 'custom',
      defaultValue: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditTag = (tag: MergeTag) => {
    setIsEditMode(true);
    setSelectedTagId(tag.id);
    form.reset({
      name: tag.name,
      tag: tag.tag,
      description: tag.description,
      category: tag.category as MergeTagCategory,
      defaultValue: tag.example || '',
    });
    setIsDialogOpen(true);
  };

  const handleDeleteTag = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom merge tag?')) return;

    try {
      await mergeTagService.deleteCustomMergeTag(id);
      setCustomTags(customTags.filter(tag => tag.id !== id));
      toast.success('Custom merge tag deleted successfully');
    } catch (error) {
      console.error('Error deleting merge tag:', error);
      toast.error('Failed to delete merge tag');
    }
  };

  const onSubmit = async (data: MergeTagFormValues) => {
    if (!activeAssociation) {
      toast.error('No active association selected');
      return;
    }

    try {
      if (isEditMode && selectedTagId) {
        // Update existing tag
        const updatedTag = await mergeTagService.updateCustomMergeTag(selectedTagId, {
          name: data.name,
          description: data.description,
          category: data.category as MergeTagCategory,
          tag: data.tag,
          example: data.defaultValue,
        });

        setCustomTags(prevTags => 
          prevTags.map(tag => tag.id === selectedTagId ? updatedTag : tag)
        );

        toast.success('Custom merge tag updated');
      } else {
        // Create new tag
        const tagDefinition: CustomMergeTagDefinition = {
          name: data.name,
          tag: data.tag,
          description: data.description,
          category: data.category as MergeTagCategory,
          associationId: activeAssociation.id,
          defaultValue: data.defaultValue,
        };

        const newTag = await mergeTagService.createCustomMergeTag(tagDefinition);
        setCustomTags(prevTags => [...prevTags, newTag]);
        toast.success('Custom merge tag created');
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving merge tag:', error);
      toast.error('Failed to save merge tag');
    }
  };

  // Helper to format tag for display
  const formatTag = (tag: string) => {
    if (!tag.startsWith('{{')) {
      return `{{${tag}}}`;
    }
    return tag;
  };

  // Auto-generate tag from name
  const generateTagFromName = (name: string) => {
    const category = form.getValues().category;
    const formattedName = name.toLowerCase().replace(/\s+/g, '_');
    return `{{custom.${category}.${formattedName}}}`;
  };

  // Update tag when name or category changes
  const updateTagFromName = (name: string) => {
    if (!isEditMode || form.getValues().tag === '') {
      form.setValue('tag', generateTagFromName(name));
    }
  };

  const updateTagFromCategory = (category: string) => {
    const name = form.getValues().name;
    if (name && (!isEditMode || form.getValues().tag === '')) {
      form.setValue('tag', generateTagFromName(name));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Tag className="mr-2 h-5 w-5" />
          Custom Merge Tags
        </CardTitle>
        <CardDescription>
          Create custom merge tags for dynamic content in communications and workflows
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!activeAssociation ? (
          <div className="text-center py-6 text-muted-foreground">
            Please select an association to manage custom merge tags
          </div>
        ) : (
          <div className="space-y-4">
            <Button onClick={handleAddTag} className="mb-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Custom Merge Tag
            </Button>

            {customTags.length === 0 ? (
              <div className="text-center py-6 border rounded-md bg-muted/20">
                <Tag className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No custom merge tags created yet</p>
                <p className="text-sm text-muted-foreground">
                  Create custom merge tags to use in your communications and workflows
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {customTags.map(tag => (
                  <div 
                    key={tag.id} 
                    className="p-4 border rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h4 className="font-medium">{tag.name}</h4>
                        <span className="text-sm text-muted-foreground">({tag.category})</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{tag.description}</p>
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded mt-2">{tag.tag}</code>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleEditTag(tag)}
                        title="Edit tag"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleDeleteTag(tag.id)}
                        title="Delete tag"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {isEditMode ? 'Edit Custom Merge Tag' : 'Create Custom Merge Tag'}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g. Building Manager Name" 
                              onChange={(e) => {
                                field.onChange(e);
                                updateTagFromName(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Descriptive name for this merge tag
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              updateTagFromCategory(value);
                            }} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categoryOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Group similar merge tags together
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tag"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tag</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g. {{custom.association.building_manager}}"
                            />
                          </FormControl>
                          <FormDescription>
                            Tag used in templates (auto-generated, can be customized)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Describe what this merge tag is used for"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="defaultValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Value (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Default value when no data is available"
                            />
                          </FormControl>
                          <FormDescription>
                            Used as fallback when no data is available
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">
                        {isEditMode ? 'Update Merge Tag' : 'Create Merge Tag'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomMergeTagsSettings;
