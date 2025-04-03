
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
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { LogIn, LogOut } from 'lucide-react';
import { OnboardingTemplate } from '@/types/onboarding';
import { onboardingService } from '@/services/onboardingService';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: (
    associationId: string, 
    associationName: string, 
    templateId: string,
    processType?: 'onboarding' | 'offboarding'
  ) => Promise<void>;
}

// Mock data for associations
const mockAssociations = [
  { id: '101', name: 'Sunset Valley HOA' },
  { id: '102', name: 'Oakridge Condos' },
  { id: '103', name: 'Pine Creek Apartments' },
  { id: '104', name: 'Meadow Ridge Community' },
];

const formSchema = z.object({
  associationId: z.string().min(1, "Association is required"),
  templateId: z.string().min(1, "Template is required"),
  processType: z.enum(['onboarding', 'offboarding']).default('onboarding'),
});

const NewProjectDialog: React.FC<NewProjectDialogProps> = ({ 
  open, 
  onOpenChange, 
  onCreateProject 
}) => {
  const [templates, setTemplates] = useState<OnboardingTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<OnboardingTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      associationId: '',
      templateId: '',
      processType: 'onboarding'
    }
  });
  
  // Load templates when dialog opens
  useEffect(() => {
    if (open) {
      loadTemplates();
    } else {
      form.reset({
        associationId: '',
        templateId: '',
        processType: 'onboarding'
      });
    }
  }, [open, form]);
  
  // Filter templates based on process type
  useEffect(() => {
    const processType = form.watch('processType');
    const filtered = templates.filter(t => t.processType === processType);
    setFilteredTemplates(filtered);
  }, [templates, form.watch('processType')]);
  
  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const templatesData = await onboardingService.getTemplates();
      setTemplates(templatesData);
      
      // Initially filter for onboarding templates
      setFilteredTemplates(templatesData.filter(t => t.processType === 'onboarding'));
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      // Find association name
      const association = mockAssociations.find(a => a.id === values.associationId);
      if (!association) {
        toast.error('Association not found');
        return;
      }
      
      await onCreateProject(
        values.associationId, 
        association.name, 
        values.templateId,
        values.processType
      );
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Create a new onboarding or offboarding project for a client association
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="processType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Process Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="onboarding" id="onboarding" />
                        <Label htmlFor="onboarding" className="flex items-center cursor-pointer">
                          <LogIn className="h-4 w-4 mr-2 text-green-500" />
                          Onboarding Process
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="offboarding" id="offboarding" />
                        <Label htmlFor="offboarding" className="flex items-center cursor-pointer">
                          <LogOut className="h-4 w-4 mr-2 text-amber-500" />
                          Offboarding Process
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Select whether you're creating an onboarding or offboarding process
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="associationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Association</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select association" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockAssociations.map(association => (
                        <SelectItem 
                          key={association.id} 
                          value={association.id}
                        >
                          {association.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the association for this project
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="templateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          isLoading 
                            ? "Loading templates..." 
                            : filteredTemplates.length === 0 
                              ? `No ${form.watch('processType')} templates available` 
                              : "Select template"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredTemplates.map(template => (
                        <SelectItem 
                          key={template.id} 
                          value={template.id}
                        >
                          {template.name}
                          {template.clientType && ` (${template.clientType})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a template for the {form.watch('processType')} process
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                disabled={isLoading || filteredTemplates.length === 0}
              >
                {isLoading ? 'Creating...' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
