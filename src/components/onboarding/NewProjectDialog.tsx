
import React, { useState, useEffect } from 'react';
import { Building2, Copy, Folder } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { onboardingService } from '@/services/onboardingService';
import { OnboardingTemplate } from '@/types/onboarding';
import { associationService } from '@/services/associationService';

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: (associationId: string, associationName: string, templateId: string) => void;
}

const formSchema = z.object({
  associationId: z.string({
    required_error: "Please select an association",
  }),
  templateId: z.string({
    required_error: "Please select a template",
  }),
});

const NewProjectDialog: React.FC<NewProjectDialogProps> = ({
  open,
  onOpenChange,
  onCreateProject
}) => {
  const [associations, setAssociations] = useState<any[]>([]);
  const [templates, setTemplates] = useState<OnboardingTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      associationId: "",
      templateId: "",
    },
  });
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load associations
        const associationsData = await associationService.getAssociations();
        setAssociations(associationsData);
        
        // Load templates
        const templatesData = await onboardingService.getTemplates();
        setTemplates(templatesData);
        
        // Set default template if available
        const defaultTemplate = templatesData.find(t => t.isDefault);
        if (defaultTemplate) {
          form.setValue('templateId', defaultTemplate.id);
        }
      } catch (error) {
        console.error('Error loading data for new project:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (open) {
      loadData();
    }
  }, [open, form]);
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const association = associations.find(a => a.id === values.associationId);
    if (!association) return;
    
    onCreateProject(
      values.associationId,
      association.name,
      values.templateId
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Onboarding Project</DialogTitle>
          <DialogDescription>
            Create a new association onboarding project to track the process
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="associationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Association</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an association" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {associations.map((association) => (
                        <SelectItem
                          key={association.id}
                          value={association.id}
                        >
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                            {association.name}
                          </div>
                        </SelectItem>
                      ))}
                      {associations.length === 0 && (
                        <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                          No associations found
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="templateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Onboarding Template</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an onboarding template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem
                          key={template.id}
                          value={template.id}
                        >
                          <div className="flex items-center">
                            <Folder className="h-4 w-4 mr-2 text-muted-foreground" />
                            {template.name}
                            {template.isDefault && ' (Default)'}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || associations.length === 0}
              >
                Create Onboarding Project
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
