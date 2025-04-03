
import React, { useState } from 'react';
import { File, Download, Check, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TooltipButton } from '@/components/ui/tooltip-button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Project } from '@/types/onboarding';
import { useToast } from '@/hooks/use-toast';
import TemplateList from './TemplateList';

interface TemplateManagementProps {
  project: Project;
}

const TemplateManagement: React.FC<TemplateManagementProps> = ({ project }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('documents');
  
  const handleApplyTemplate = (templateId: string) => {
    toast({
      title: "Template Applied",
      description: "The selected template has been applied to this project"
    });
  };
  
  const handleDownloadTemplate = (templateId: string) => {
    toast({
      title: "Template Downloaded",
      description: "The template has been downloaded"
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="emails">Email Templates</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="pt-4">
          <TemplateList 
            title="Document Templates" 
            description="Apply document templates to this onboarding project"
            templates={[
              { id: 'd1', name: 'Standard HOA Document Package', description: 'Complete set of standard documents for new associations', category: 'documents' },
              { id: 'd2', name: 'Condominium Bylaws Template', description: 'Standard condominium bylaws document', category: 'legal' },
              { id: 'd3', name: 'Rules & Regulations', description: 'Template for community rules and regulations', category: 'documents' },
              { id: 'd4', name: 'Welcome Package', description: 'New resident welcome documents and information', category: 'communications' }
            ]}
            onApplyTemplate={handleApplyTemplate}
            onDownloadTemplate={handleDownloadTemplate}
          />
        </TabsContent>
        
        <TabsContent value="emails" className="pt-4">
          <TemplateList 
            title="Email Templates" 
            description="Apply email templates to this onboarding project"
            templates={[
              { id: 'e1', name: 'Welcome Email Sequence', description: 'Series of 5 emails to welcome new association members', category: 'communications' },
              { id: 'e2', name: 'Board Introduction', description: 'Introduce the new board members to the community', category: 'communications' },
              { id: 'e3', name: 'Payment Instructions', description: 'Instructions for setting up assessment payments', category: 'financial' },
              { id: 'e4', name: 'Portal Access Guide', description: 'Guide for accessing the resident portal', category: 'technical' }
            ]}
            onApplyTemplate={handleApplyTemplate}
            onDownloadTemplate={handleDownloadTemplate}
          />
        </TabsContent>
        
        <TabsContent value="workflows" className="pt-4">
          <TemplateList 
            title="Workflow Templates" 
            description="Apply workflow templates to this onboarding project"
            templates={[
              { id: 'w1', name: 'Standard Onboarding Workflow', description: 'Complete workflow for onboarding new associations', category: 'workflow' },
              { id: 'w2', name: 'Financial Setup Workflow', description: 'Workflow for setting up financial accounts and systems', category: 'financial' },
              { id: 'w3', name: 'Board Training Workflow', description: 'Process for training new board members', category: 'training' },
              { id: 'w4', name: 'Document Collection Workflow', description: 'Process for collecting and organizing association documents', category: 'documents' }
            ]}
            onApplyTemplate={handleApplyTemplate}
            onDownloadTemplate={handleDownloadTemplate}
          />
        </TabsContent>
      </Tabs>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Applied Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Selected Templates</h3>
              <TooltipButton 
                tooltipText="Apply all selected templates"
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                Apply All
              </TooltipButton>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                  <div className="flex items-center gap-2">
                    <File className="h-5 w-5 text-blue-500" />
                    <span>Standard HOA Document Package</span>
                    <Badge className="ml-2" variant="secondary">Documents</Badge>
                  </div>
                  <div className="flex gap-1">
                    <TooltipButton 
                      tooltipText="Edit template selection"
                      variant="ghost" 
                      size="sm"
                    >
                      <Edit className="h-4 w-4" />
                    </TooltipButton>
                    <TooltipButton 
                      tooltipText="Remove this template"
                      variant="ghost" 
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </TooltipButton>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                  <div className="flex items-center gap-2">
                    <File className="h-5 w-5 text-blue-500" />
                    <span>Welcome Email Sequence</span>
                    <Badge className="ml-2" variant="secondary">Communications</Badge>
                  </div>
                  <div className="flex gap-1">
                    <TooltipButton 
                      tooltipText="Edit template selection"
                      variant="ghost" 
                      size="sm"
                    >
                      <Edit className="h-4 w-4" />
                    </TooltipButton>
                    <TooltipButton 
                      tooltipText="Remove this template"
                      variant="ghost" 
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </TooltipButton>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                  <div className="flex items-center gap-2">
                    <File className="h-5 w-5 text-blue-500" />
                    <span>Standard Onboarding Workflow</span>
                    <Badge className="ml-2" variant="secondary">Workflow</Badge>
                  </div>
                  <div className="flex gap-1">
                    <TooltipButton 
                      tooltipText="Edit template selection"
                      variant="ghost" 
                      size="sm"
                    >
                      <Edit className="h-4 w-4" />
                    </TooltipButton>
                    <TooltipButton 
                      tooltipText="Remove this template"
                      variant="ghost" 
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </TooltipButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateManagement;
