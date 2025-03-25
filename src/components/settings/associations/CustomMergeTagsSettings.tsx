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
          example: data.defaultValue,
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
    <></>
  );
};

export default CustomMergeTagsSettings;
