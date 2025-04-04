
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkflowTemplates from '@/components/workflows/WorkflowTemplates';
import WorkflowBuilder from '@/components/workflows/WorkflowBuilder';
import ActiveWorkflows from '@/components/workflows/ActiveWorkflows';
import CustomWorkflows from '@/components/workflows/CustomWorkflows';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

const Workflows = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState(tabFromUrl || "templates");
  
  // Sync URL with tab changes
  useEffect(() => {
    if (tabFromUrl && ['templates', 'active', 'custom', 'builder'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // If we're on builder tab with an ID, preserve ID when switching tabs
    const id = searchParams.get('id');
    const readonly = searchParams.get('readonly');
    
    let newParams = `tab=${value}`;
    if (value === 'builder' && id) {
      newParams += `&id=${id}`;
      if (readonly) {
        newParams += `&readonly=${readonly}`;
      }
    }
    
    navigate(`/workflows?${newParams}`);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Workflow Management</h1>
        <p className="text-muted-foreground">
          Create and manage automated workflows for your association processes
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="z-50">
                <p>Browse workflow templates</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="active">Active Workflows</TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="z-50">
                <p>View currently active workflows</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="custom">Custom Workflows</TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="z-50">
                <p>Browse your custom workflows</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="builder">Workflow Builder</TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="z-50">
                <p>Create or edit workflows</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TabsList>
        
        <TabsContent value="templates">
          <WorkflowTemplates />
        </TabsContent>
        
        <TabsContent value="active">
          <ActiveWorkflows />
        </TabsContent>
        
        <TabsContent value="custom">
          <CustomWorkflows />
        </TabsContent>
        
        <TabsContent value="builder">
          <WorkflowBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Workflows;
