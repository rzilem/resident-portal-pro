
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription,
  FormMessage 
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CalendarIcon, 
  Check, 
  GripVertical, 
  Plus, 
  Save, 
  Trash2 
} from "lucide-react";
import { OnboardingTemplate, OnboardingTaskGroup } from '@/types/onboarding';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { v4 as uuid } from 'uuid';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TemplateEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: OnboardingTemplate | null;
  onSave: (template: OnboardingTemplate) => Promise<void>;
}

const formSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().min(1, "Template description is required"),
  clientType: z.string().optional(),
  isDefault: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  processType: z.enum(['onboarding', 'offboarding']).default('onboarding'),
});

const TemplateEditor: React.FC<TemplateEditorProps> = ({ 
  open, 
  onOpenChange, 
  template, 
  onSave 
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [taskGroups, setTaskGroups] = useState<OnboardingTaskGroup[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState('');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: template?.name || '',
      description: template?.description || '',
      clientType: template?.clientType || '',
      isDefault: template?.isDefault || false,
      tags: template?.tags || [],
      processType: template?.processType || 'onboarding',
    },
  });
  
  // Update form when template changes
  useEffect(() => {
    if (template) {
      form.reset({
        name: template.name,
        description: template.description,
        clientType: template.clientType || '',
        isDefault: template.isDefault || false,
        tags: template.tags || [],
        processType: template.processType || 'onboarding',
      });
      setTaskGroups(template.taskGroups);
    } else {
      form.reset({
        name: '',
        description: '',
        clientType: '',
        isDefault: false,
        tags: [],
        processType: 'onboarding',
      });
      setTaskGroups([]);
    }
  }, [template, form]);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Calculate total tasks for each group
      const updatedTaskGroups = taskGroups.map(group => ({
        ...group,
        totalTasks: group.tasks.length,
        completedTasks: group.tasks.filter(task => task.status === 'completed').length
      }));
      
      // Create new template or update existing
      const updatedTemplate: OnboardingTemplate = {
        id: template?.id || uuid(),
        name: values.name,
        description: values.description,
        clientType: values.clientType || undefined,
        isDefault: values.isDefault,
        tags: values.tags,
        taskGroups: updatedTaskGroups,
        createdAt: template?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        processType: values.processType,
      };
      
      await onSave(updatedTemplate);
      setIsSubmitting(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving template:', error);
      setIsSubmitting(false);
    }
  };
  
  const addTaskGroup = () => {
    const newGroup: OnboardingTaskGroup = {
      id: uuid(),
      title: `Task Group ${taskGroups.length + 1}`,
      day: taskGroups.length > 0 ? Math.max(...taskGroups.map(g => g.day)) + 7 : 1,
      tasks: [],
      completedTasks: 0,
      totalTasks: 0
    };
    
    setTaskGroups([...taskGroups, newGroup]);
  };
  
  const updateTaskGroup = (index: number, updates: Partial<OnboardingTaskGroup>) => {
    const updatedGroups = [...taskGroups];
    updatedGroups[index] = { ...updatedGroups[index], ...updates };
    setTaskGroups(updatedGroups);
  };
  
  const deleteTaskGroup = (index: number) => {
    const updatedGroups = [...taskGroups];
    updatedGroups.splice(index, 1);
    setTaskGroups(updatedGroups);
  };
  
  const addTask = (groupIndex: number) => {
    const updatedGroups = [...taskGroups];
    const group = { ...updatedGroups[groupIndex] };
    
    group.tasks.push({
      id: uuid(),
      title: `Task ${group.tasks.length + 1}`,
      days: 1,
      status: 'not_started',
      category: 'internal',
      teamAssigned: false,
      clientVisible: true
    });
    
    updatedGroups[groupIndex] = group;
    setTaskGroups(updatedGroups);
  };
  
  const updateTask = (groupIndex: number, taskIndex: number, updates: Partial<any>) => {
    const updatedGroups = [...taskGroups];
    const group = { ...updatedGroups[groupIndex] };
    group.tasks = [...group.tasks];
    group.tasks[taskIndex] = { ...group.tasks[taskIndex], ...updates };
    updatedGroups[groupIndex] = group;
    setTaskGroups(updatedGroups);
  };
  
  const deleteTask = (groupIndex: number, taskIndex: number) => {
    const updatedGroups = [...taskGroups];
    const group = { ...updatedGroups[groupIndex] };
    group.tasks = [...group.tasks];
    group.tasks.splice(taskIndex, 1);
    updatedGroups[groupIndex] = group;
    setTaskGroups(updatedGroups);
  };
  
  const addTagToForm = () => {
    if (newTag.trim() && !form.getValues().tags.includes(newTag.trim())) {
      const currentTags = form.getValues().tags;
      form.setValue('tags', [...currentTags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const removeTagFromForm = (tag: string) => {
    const currentTags = form.getValues().tags;
    form.setValue('tags', currentTags.filter(t => t !== tag));
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>{template ? 'Edit Template' : 'Create New Template'}</DialogTitle>
          <DialogDescription>
            {template 
              ? 'Edit this template to update the onboarding or offboarding process'
              : 'Create a new template for client onboarding or offboarding'}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Template Details</TabsTrigger>
            <TabsTrigger value="tasks">Task Groups</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col">
              <TabsContent value="details" className="flex-1 overflow-y-auto">
                <div className="space-y-6 p-1">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter template name" {...field} />
                        </FormControl>
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
                            placeholder="Enter template description"
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="clientType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Type</FormLabel>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select client type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="hoa">HOA</SelectItem>
                              <SelectItem value="condo">Condo</SelectItem>
                              <SelectItem value="apartment">Apartment</SelectItem>
                              <SelectItem value="commercial">Commercial</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Specify what type of client this template is for
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="processType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Process Type</FormLabel>
                          <Select 
                            value={field.value} 
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select process type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="onboarding">Onboarding</SelectItem>
                              <SelectItem value="offboarding">Offboarding</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Is this an onboarding or offboarding process?
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="isDefault"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Default Template</FormLabel>
                          <FormDescription>
                            Set as the default template for new clients
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tags"
                    render={() => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {form.getValues().tags.map(tag => (
                            <Badge 
                              key={tag} 
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTagFromForm(tag)}
                                className="text-muted-foreground hover:text-foreground ml-1"
                              >
                                &times;
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Add a tag"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addTagToForm();
                              }
                            }}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={addTagToForm}
                          >
                            Add
                          </Button>
                        </div>
                        <FormDescription>
                          Add tags to help organize and filter templates
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="tasks" className="flex-1 flex flex-col overflow-hidden">
                <ScrollArea className="flex-1">
                  <div className="space-y-6 p-1">
                    {taskGroups.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">No task groups defined yet</p>
                        <Button type="button" onClick={addTaskGroup}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Task Group
                        </Button>
                      </div>
                    ) : (
                      taskGroups.map((group, groupIndex) => (
                        <div 
                          key={group.id} 
                          className="border rounded-md overflow-hidden"
                        >
                          <div className="bg-muted p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                              <Input
                                value={group.title}
                                onChange={(e) => updateTaskGroup(groupIndex, { title: e.target.value })}
                                className="font-medium w-[250px]"
                              />
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground mr-1">Day:</span>
                                <Input
                                  type="number"
                                  value={group.day}
                                  onChange={(e) => updateTaskGroup(groupIndex, { day: parseInt(e.target.value) || 0 })}
                                  className="w-[70px]"
                                  min={0}
                                />
                              </div>
                              
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteTaskGroup(groupIndex)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="p-4 space-y-2">
                            {group.tasks.map((task, taskIndex) => (
                              <div 
                                key={task.id}
                                className="border border-border rounded-md p-3 flex flex-col gap-3"
                              >
                                <div className="flex justify-between items-start">
                                  <Input
                                    value={task.title}
                                    onChange={(e) => updateTask(groupIndex, taskIndex, { title: e.target.value })}
                                    className="font-medium flex-1 mr-2"
                                    placeholder="Task title"
                                  />
                                  
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteTask(groupIndex, taskIndex)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Estimated time:</span>
                                    <Input
                                      type="number"
                                      value={task.days}
                                      onChange={(e) => updateTask(groupIndex, taskIndex, { days: parseInt(e.target.value) || 1 })}
                                      className="w-[70px]"
                                      min={1}
                                    />
                                    <span className="text-sm text-muted-foreground">days</span>
                                  </div>
                                  
                                  <Select
                                    value={task.category}
                                    onValueChange={(value) => updateTask(groupIndex, taskIndex, { category: value })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Task category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="internal">Internal</SelectItem>
                                      <SelectItem value="client">Client</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  
                                  <div className="flex items-center justify-between space-x-2">
                                    <span className="text-sm">Client visible:</span>
                                    <Switch
                                      checked={task.clientVisible}
                                      onCheckedChange={(checked) => updateTask(groupIndex, taskIndex, { clientVisible: checked })}
                                    />
                                  </div>
                                </div>
                                
                                <Textarea
                                  value={task.description || ''}
                                  onChange={(e) => updateTask(groupIndex, taskIndex, { description: e.target.value })}
                                  placeholder="Task description (optional)"
                                  className="min-h-[80px]"
                                />
                              </div>
                            ))}
                            
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => addTask(groupIndex)}
                              className="w-full mt-2"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Task
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                    
                    {taskGroups.length > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addTaskGroup}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task Group
                      </Button>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Template
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateEditor;
