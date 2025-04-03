
import React, { useState, useEffect } from 'react';
import { 
  Plus,
  Save, 
  Trash2, 
  ArrowUp, 
  ArrowDown,
  CalendarDays
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from 'sonner';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { OnboardingTemplate, OnboardingTaskGroup, OnboardingTask } from '@/types/onboarding';
import { v4 as uuid } from 'uuid';

// Form validation schema
const templateFormSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  clientType: z.string().min(1, "Client type is required"),
  isDefault: z.boolean().optional(),
  tags: z.string().optional()
});

interface TemplateEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: OnboardingTemplate | null;
  onSave: (template: OnboardingTemplate) => Promise<void>;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({
  open,
  onOpenChange,
  template,
  onSave
}) => {
  const [taskGroups, setTaskGroups] = useState<OnboardingTaskGroup[]>([]);
  const [activeTaskGroupId, setActiveTaskGroupId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<z.infer<typeof templateFormSchema>>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: "",
      description: "",
      clientType: "hoa",
      isDefault: false,
      tags: ""
    }
  });
  
  // Initialize form when template changes
  useEffect(() => {
    if (template) {
      form.reset({
        name: template.name,
        description: template.description || '',
        clientType: template.clientType || 'hoa',
        isDefault: template.isDefault || false,
        tags: template.tags?.join(', ') || ''
      });
      
      setTaskGroups([...template.taskGroups]);
      
      if (template.taskGroups.length > 0) {
        setActiveTaskGroupId(template.taskGroups[0].id);
      }
    } else {
      // Default empty form
      form.reset({
        name: "",
        description: "",
        clientType: "hoa",
        isDefault: false,
        tags: ""
      });
      
      // Create one empty task group
      const initialGroup: OnboardingTaskGroup = {
        id: uuid(),
        title: 'Day 1',
        day: 1,
        tasks: [],
        completedTasks: 0,
        totalTasks: 0
      };
      
      setTaskGroups([initialGroup]);
      setActiveTaskGroupId(initialGroup.id);
    }
  }, [template, form]);
  
  const onSubmit = async (values: z.infer<typeof templateFormSchema>) => {
    try {
      setIsSaving(true);
      
      // Process tags
      const tagsList = values.tags
        ? values.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];
      
      const updatedTemplate: OnboardingTemplate = {
        id: template?.id || uuid(),
        name: values.name,
        description: values.description || '',
        clientType: values.clientType,
        isDefault: values.isDefault || false,
        tags: tagsList,
        taskGroups: taskGroups.map(group => ({
          ...group,
          totalTasks: group.tasks.length
        }))
      };
      
      await onSave(updatedTemplate);
      toast.success('Template saved successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleAddTaskGroup = () => {
    const day = taskGroups.length > 0 
      ? Math.max(...taskGroups.map(g => g.day)) + 5 
      : 1;
    
    const newGroup: OnboardingTaskGroup = {
      id: uuid(),
      title: `Day ${day}`,
      day,
      tasks: [],
      completedTasks: 0,
      totalTasks: 0
    };
    
    setTaskGroups([...taskGroups, newGroup]);
    setActiveTaskGroupId(newGroup.id);
  };
  
  const handleDeleteTaskGroup = (groupId: string) => {
    if (taskGroups.length <= 1) {
      toast.error('You must have at least one task group');
      return;
    }
    
    if (confirm('Are you sure you want to delete this task group?')) {
      const newGroups = taskGroups.filter(g => g.id !== groupId);
      setTaskGroups(newGroups);
      
      if (activeTaskGroupId === groupId && newGroups.length > 0) {
        setActiveTaskGroupId(newGroups[0].id);
      }
    }
  };
  
  const handleMoveTaskGroup = (groupId: string, direction: 'up' | 'down') => {
    const index = taskGroups.findIndex(g => g.id === groupId);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === taskGroups.length - 1)
    ) {
      return;
    }
    
    const newGroups = [...taskGroups];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap positions
    [newGroups[index], newGroups[newIndex]] = [newGroups[newIndex], newGroups[index]];
    
    setTaskGroups(newGroups);
  };
  
  const handleAddTask = (groupId: string) => {
    const updatedGroups = taskGroups.map(group => {
      if (group.id === groupId) {
        const newTask: OnboardingTask = {
          id: uuid(),
          title: 'New Task',
          days: 5,
          status: 'not_started',
          category: 'internal',
          teamAssigned: true,
          clientVisible: true
        };
        
        return {
          ...group,
          tasks: [...group.tasks, newTask]
        };
      }
      return group;
    });
    
    setTaskGroups(updatedGroups);
  };
  
  const handleTaskChange = (groupId: string, taskId: string, updates: Partial<OnboardingTask>) => {
    const updatedGroups = taskGroups.map(group => {
      if (group.id === groupId) {
        const updatedTasks = group.tasks.map(task => {
          if (task.id === taskId) {
            return { ...task, ...updates };
          }
          return task;
        });
        
        return {
          ...group,
          tasks: updatedTasks
        };
      }
      return group;
    });
    
    setTaskGroups(updatedGroups);
  };
  
  const handleDeleteTask = (groupId: string, taskId: string) => {
    const updatedGroups = taskGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          tasks: group.tasks.filter(task => task.id !== taskId)
        };
      }
      return group;
    });
    
    setTaskGroups(updatedGroups);
  };
  
  const handleTaskGroupChange = (groupId: string, updates: Partial<OnboardingTaskGroup>) => {
    const updatedGroups = taskGroups.map(group => {
      if (group.id === groupId) {
        return { ...group, ...updates };
      }
      return group;
    });
    
    setTaskGroups(updatedGroups);
  };
  
  const activeGroup = taskGroups.find(g => g.id === activeTaskGroupId);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{template ? 'Edit Template' : 'Create Template'}</DialogTitle>
          <DialogDescription>
            {template ? 'Modify the onboarding template settings and tasks' : 'Create a new onboarding template for client onboarding'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              {/* Template Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  name="clientType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hoa">Homeowners Association</SelectItem>
                          <SelectItem value="condo">Condominium</SelectItem>
                          <SelectItem value="apartment">Apartment Complex</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter template description"
                        {...field}
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. large, gated, pool" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-end space-x-2 pt-6">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Set as default template</FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
          
          {/* Task Groups Section */}
          <div className="border rounded-md">
            <div className="p-4 border-b bg-muted/40">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Task Groups</h3>
                <Button onClick={handleAddTaskGroup} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Group
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row h-[400px] overflow-hidden">
              {/* Task Group Tabs */}
              <div className="sm:w-1/3 border-r overflow-auto">
                <div className="space-y-1 p-2">
                  {taskGroups.map((group, index) => (
                    <div 
                      key={group.id}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                        activeTaskGroupId === group.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setActiveTaskGroupId(group.id)}
                    >
                      <div className="flex items-center space-x-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>{group.title} ({group.tasks.length})</span>
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveTaskGroup(group.id, 'up');
                          }}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveTaskGroup(group.id, 'down');
                          }}
                          disabled={index === taskGroups.length - 1}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTaskGroup(group.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Task Group Content */}
              <div className="sm:w-2/3 overflow-auto">
                {activeGroup ? (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="group-title">Group Title</Label>
                        <Input 
                          id="group-title"
                          value={activeGroup.title}
                          onChange={(e) => handleTaskGroupChange(activeGroup.id, { title: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="group-day">Day Number</Label>
                        <Input 
                          id="group-day"
                          type="number"
                          min="1"
                          value={activeGroup.day}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value) && value > 0) {
                              handleTaskGroupChange(activeGroup.id, { day: value });
                            }
                          }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Tasks ({activeGroup.tasks.length})</Label>
                        <Button 
                          onClick={() => handleAddTask(activeGroup.id)} 
                          variant="outline" 
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Task
                        </Button>
                      </div>
                      
                      <div className="space-y-2 max-h-[250px] overflow-y-auto border rounded-md p-2">
                        {activeGroup.tasks.length === 0 ? (
                          <div className="text-center py-4 text-muted-foreground">
                            No tasks in this group. Click 'Add Task' to create one.
                          </div>
                        ) : (
                          activeGroup.tasks.map((task) => (
                            <div key={task.id} className="border rounded-md p-3 space-y-2">
                              <div className="flex justify-between">
                                <Input 
                                  value={task.title}
                                  onChange={(e) => handleTaskChange(activeGroup.id, task.id, { title: e.target.value })}
                                  placeholder="Task title"
                                  className="flex-1 mr-2"
                                />
                                
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                  onClick={() => handleDeleteTask(activeGroup.id, task.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label htmlFor={`task-days-${task.id}`} className="text-xs">Days to Complete</Label>
                                  <Input 
                                    id={`task-days-${task.id}`}
                                    type="number"
                                    min="1"
                                    value={task.days}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value);
                                      if (!isNaN(value) && value > 0) {
                                        handleTaskChange(activeGroup.id, task.id, { days: value });
                                      }
                                    }}
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor={`task-category-${task.id}`} className="text-xs">Category</Label>
                                  <Select
                                    value={task.category}
                                    onValueChange={(value: 'internal' | 'client') => 
                                      handleTaskChange(activeGroup.id, task.id, { category: value })
                                    }
                                  >
                                    <SelectTrigger id={`task-category-${task.id}`}>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="internal">Internal</SelectItem>
                                      <SelectItem value="client">Client</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`team-assigned-${task.id}`}
                                    checked={task.teamAssigned}
                                    onCheckedChange={(checked) => 
                                      handleTaskChange(activeGroup.id, task.id, { teamAssigned: !!checked })
                                    }
                                  />
                                  <Label 
                                    htmlFor={`team-assigned-${task.id}`}
                                    className="text-xs"
                                  >
                                    Team Assigned
                                  </Label>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`client-visible-${task.id}`}
                                    checked={task.clientVisible}
                                    onCheckedChange={(checked) => 
                                      handleTaskChange(activeGroup.id, task.id, { clientVisible: !!checked })
                                    }
                                  />
                                  <Label 
                                    htmlFor={`client-visible-${task.id}`}
                                    className="text-xs"
                                  >
                                    Client Visible
                                  </Label>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No task group selected
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateEditor;
