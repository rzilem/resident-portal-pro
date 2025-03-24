
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkflowTemplates from '@/components/workflows/WorkflowTemplates';
import WorkflowBuilder from '@/components/workflows/WorkflowBuilder';
import ActiveWorkflows from '@/components/workflows/ActiveWorkflows';
import CustomWorkflows from '@/components/workflows/CustomWorkflows';

const Workflows = () => {
  const [activeTab, setActiveTab] = useState("templates");
  
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Workflow Management</h1>
        <p className="text-muted-foreground">
          Create and manage automated workflows for your association processes
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="active">Active Workflows</TabsTrigger>
          <TabsTrigger value="custom">Custom Workflows</TabsTrigger>
          <TabsTrigger value="builder">Workflow Builder</TabsTrigger>
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
