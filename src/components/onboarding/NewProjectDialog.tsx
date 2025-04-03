
import React, { useState, useEffect } from 'react';
import { Building2, Copy, Folder, FileText } from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { onboardingService } from '@/services/onboardingService';
import { OnboardingTemplate } from '@/types/onboarding';
import { associationService } from '@/services/associationService';
import { Badge } from '@/components/ui/badge';

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
  const [filteredTemplates, setFilteredTemplates] = useState<OnboardingTemplate[]>([]);
  const [selectedClientType, setSelectedClientType] = useState<string>('all');
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
        setFilteredTemplates(templatesData);
        
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
  
  // Filter templates when client type changes
  useEffect(() => {
    if (selectedClientType === 'all') {
      setFilteredTemplates(templates);
    } else {
      setFilteredTemplates(
        templates.filter(t => !t.clientType || t.clientType === selectedClientType)
      );
    }
    
    // Reset template selection if the current selection is not in filtered list
    const currentTemplateId = form.getValues('templateId');
    const templateStillAvailable = filteredTemplates.some(t => t.id === currentTemplateId);
    
    if (currentTemplateId && !templateStillAvailable) {
      // Find a default template in the filtered list or just the first one
      const defaultTemplate = filteredTemplates.find(t => t.isDefault);
      if (defaultTemplate) {
        form.setValue('templateId', defaultTemplate.id);
      } else if (filteredTemplates.length > 0) {
        form.setValue('templateId', filteredTemplates[0].id);
      } else {
        form.setValue('templateId', '');
      }
    }
  }, [selectedClientType, templates, form]);
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const association = associations.find(a => a.id === values.associationId);
    if (!association) return;
    
    onCreateProject(
      values.associationId,
      association.name,
      values.templateId
    );
  };
  
  // Get unique client types from templates
  const clientTypes = Array.from(
    new Set(['all', ...(templates.map(t => t.clientType || 'undefined').filter(Boolean))])
  );
  
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
            
            <div>
              <label className="text-sm font-medium">Template Type</label>
              <RadioGroup 
                defaultValue="all" 
                className="flex flex-wrap gap-2 mt-2"
                value={selectedClientType}
                onValueChange={setSelectedClientType}
              >
                {clientTypes.map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={`type-${type}`} />
                    <label 
                      htmlFor={`type-${type}`} 
                      className="text-sm cursor-pointer capitalize"
                    >
                      {type === 'all' ? 'All Types' : type}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <FormField
              control={form.control}
              name="templateId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Onboarding Template</FormLabel>
                  <Select
                    disabled={isLoading || filteredTemplates.length === 0}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an onboarding template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredTemplates.map((template) => (
                        <SelectItem
                          key={template.id}
                          value={template.id}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{template.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {template.isDefault && (
                                <Badge variant="secondary" className="text-xs">Default</Badge>
                              )}
                              {template.clientType && (
                                <Badge variant="outline" className="text-xs capitalize">{template.clientType}</Badge>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                      {filteredTemplates.length === 0 && (
                        <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                          No matching templates found
                        </div>
                      )}
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
                disabled={isLoading || associations.length === 0 || filteredTemplates.length === 0}
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
