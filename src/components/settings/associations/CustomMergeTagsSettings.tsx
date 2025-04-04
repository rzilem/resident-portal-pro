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
        const updatedTag = await mergeTagService.updateCustomMergeTag(selectedTagId, {
          name: data.name,
          description: data.description,
          category: data.category as MergeTagCategory,
          tag: data.tag,
          defaultValue: data.defaultValue,
        });

        setCustomTags(prevTags => 
          prevTags.map(tag => tag.id === selectedTagId ? updatedTag : tag)
        );

        toast.success('Custom merge tag updated');
      } else {
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

  const formatTag = (tag: string) => {
    if (!tag.startsWith('{{')) {
      return `{{${tag}}}`;
    }
    return tag;
  };

  const generateTagFromName = (name: string) => {
    const category = form.getValues().category;
    const formattedName = name.toLowerCase().replace(/\s+/g, '_');
    return `{{custom.${category}.${formattedName}}}`;
  };

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Custom Merge Tags</h2>
        <Button onClick={handleAddTag}>
          <Plus className="mr-2 h-4 w-4" />
          Add Custom Tag
        </Button>
      </div>

      {customTags.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Tag className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-3 text-muted-foreground">
              No custom merge tags created yet. Custom merge tags allow you to insert personalized data in your communications.
            </p>
            <Button className="mt-4" onClick={handleAddTag}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Custom Tag
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {customTags.map((tag) => (
            <Card key={tag.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{tag.name}</CardTitle>
                <CardDescription className="text-xs">{tag.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <code className="text-xs bg-muted rounded-md px-2 py-1 block overflow-x-auto">{tag.tag}</code>
                <p className="text-sm">{tag.description}</p>
                {tag.example && (
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Example:</span> {tag.example}
                  </div>
                )}
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditTag(tag)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDeleteTag(tag.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Custom Merge Tag' : 'Create Custom Merge Tag'}</DialogTitle>
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
                        placeholder="e.g., Pool Access Code" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          updateTagFromName(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for the custom tag
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
                      value={field.value} 
                      onValueChange={(value) => {
                        field.onChange(value);
                        updateTagFromCategory(value);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Group related tags together
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
                    <FormLabel>Tag Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., {{custom.pool_code}}" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      The actual code that will be used in templates
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
                        placeholder="Describe what this tag represents" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Explain what this merge tag represents
                    </FormDescription>
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
                        placeholder="e.g., 1234" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      A default value to use when previewing templates
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">{isEditMode ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomMergeTagsSettings;
