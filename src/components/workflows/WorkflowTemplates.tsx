
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight } from "lucide-react";
import { useWorkflows } from '@/hooks/use-workflows';
import { getTemplateIcon } from '@/data/workflowTemplates';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { TooltipButton } from '@/components/ui/tooltip-button';

const WorkflowTemplates = () => {
  const { templates, createFromTemplate, isLoading } = useWorkflows();
  const navigate = useNavigate();

  const handleUseTemplate = async (templateId: string) => {
    try {
      const newWorkflow = await createFromTemplate(templateId);
      toast.success(`Template "${newWorkflow.name}" has been applied`);
      
      // Navigate to the workflow builder with the new workflow
      navigate(`/workflows?tab=builder&id=${newWorkflow.id}`);
    } catch (error) {
      console.error('Error using template:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="animate-pulse text-center">
          <div className="h-8 w-48 bg-muted rounded mx-auto mb-4"></div>
          <div className="h-4 w-64 bg-muted rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Predefined Workflow Templates</h2>
        <TooltipButton 
          variant="outline" 
          tooltipText="Create a new custom template"
        >
          Create Custom Template
        </TooltipButton>
      </div>
      
      <ScrollArea className="h-[600px]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="h-full flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-md bg-muted">
                    {getTemplateIcon(template)}
                  </div>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
                <CardTitle className="mt-4">{template.title}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">{template.steps} steps</span> in this workflow
                </div>
                {template.popular && (
                  <Badge className="mt-2 bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
                    Popular Template
                  </Badge>
                )}
              </CardContent>
              <CardFooter>
                <TooltipButton 
                  className="w-full" 
                  onClick={() => handleUseTemplate(template.id)}
                  tooltipText={`Use the ${template.title} template`}
                >
                  Use Template <ArrowRight className="ml-2 h-4 w-4" />
                </TooltipButton>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default WorkflowTemplates;
