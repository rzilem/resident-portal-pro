
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OnboardingTemplate, OnboardingProject } from '@/types/onboarding';

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: OnboardingTemplate[];
  onCreateProject: (data: ProjectFormData) => Promise<void>;
  isCreating: boolean;
}

export interface ProjectFormData {
  name: string;
  associationId: string;
  associationName: string;
  templateId: string;
  startDate: Date;
  processType: 'onboarding' | 'offboarding';
}

const formSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  associationId: z.string().min(1, 'Association is required'),
  associationName: z.string().min(1, 'Association name is required'),
  templateId: z.string().min(1, 'Template is required'),
  startDate: z.date(),
  processType: z.enum(['onboarding', 'offboarding']).default('onboarding'),
});

const NewProjectDialog: React.FC<NewProjectDialogProps> = ({
  open,
  onOpenChange,
  templates,
  onCreateProject,
  isCreating
}) => {
  const [associations, setAssociations] = useState([
    { id: 'assoc-1', name: 'Sunny Heights HOA' },
    { id: 'assoc-2', name: 'Oakwood Condominiums' },
    { id: 'assoc-3', name: 'Riverside Community Association' },
    { id: 'assoc-4', name: 'Pine Valley Estates' },
  ]);
  
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      associationId: '',
      associationName: '',
      templateId: '',
      startDate: new Date(),
      processType: 'onboarding',
    },
  });
  
  const handleSubmit = async (data: ProjectFormData) => {
    try {
      await onCreateProject(data);
      form.reset();
    } catch (error) {
      console.error('Error creating project:', error);
      // Error handling is done in the parent component
    }
  };
  
  // Filter templates based on process type
  const processType = form.watch('processType');
  const filteredTemplates = templates.filter(
    template => template.processType === processType
  );
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="processType"
              render={({ field }) => (
                <div className="flex items-center space-x-4 mb-4">
                  <Button
                    type="button"
                    variant={field.value === 'onboarding' ? 'default' : 'outline'}
                    onClick={() => field.onChange('onboarding')}
                    className="flex-1"
                  >
                    Onboarding
                  </Button>
                  <Button
                    type="button"
                    variant={field.value === 'offboarding' ? 'default' : 'outline'}
                    onClick={() => field.onChange('offboarding')}
                    className="flex-1"
                  >
                    Offboarding
                  </Button>
                </div>
              )}
            />
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="associationId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Association</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? associations.find((association) => association.id === field.value)?.name
                            : "Select association"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search association..." />
                        <CommandEmpty>No association found.</CommandEmpty>
                        <CommandGroup>
                          {associations.map((association) => (
                            <CommandItem
                              value={association.name}
                              key={association.id}
                              onSelect={() => {
                                form.setValue("associationId", association.id);
                                form.setValue("associationName", association.name);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  association.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {association.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="templateId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Template</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? filteredTemplates.find((template) => template.id === field.value)?.name
                            : "Select template"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search template..." />
                        <CommandEmpty>No template found.</CommandEmpty>
                        <CommandGroup>
                          {filteredTemplates.map((template) => (
                            <CommandItem
                              value={template.name}
                              key={template.id}
                              onSelect={() => {
                                form.setValue("templateId", template.id);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  template.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {template.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value}
                      onDateChange={field.onChange}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
