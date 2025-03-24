
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Sample custom workflows
const customWorkflows = [
  {
    id: 'cw1',
    name: 'Late Fee Processing for Premium Properties',
    description: 'A specialized workflow for processing late fees for premium properties with specific rules',
    category: 'Financial',
    steps: 6,
    status: 'active',
    lastEdited: '2023-05-10T14:30:00Z',
    createdBy: 'John Smith'
  },
  {
    id: 'cw2',
    name: 'Pool Access Card Activation/Deactivation',
    description: 'Manages the activation and deactivation of pool access cards based on payment status',
    category: 'Resident Management',
    steps: 4,
    status: 'active',
    lastEdited: '2023-06-05T09:15:00Z',
    createdBy: 'Sarah Johnson'
  },
  {
    id: 'cw3',
    name: 'Community Event Reminders',
    description: 'Customized sequence of reminders for community events with attendance confirmation',
    category: 'Communication',
    steps: 5,
    status: 'active',
    lastEdited: '2023-06-12T16:45:00Z',
    createdBy: 'John Smith'
  },
  {
    id: 'cw4',
    name: 'Seasonal Rule Enforcement',
    description: 'Seasonal rules enforcement workflow that activates during specific times of year',
    category: 'Compliance',
    steps: 7,
    status: 'inactive',
    lastEdited: '2023-04-20T11:30:00Z',
    createdBy: 'Emma Davis'
  },
  {
    id: 'cw5',
    name: 'Multi-tier Violation Escalation',
    description: 'Complex violation process with different paths based on violation type and history',
    category: 'Compliance',
    steps: 9,
    status: 'active',
    lastEdited: '2023-06-08T13:20:00Z',
    createdBy: 'Mike Wilson'
  },
  {
    id: 'cw6',
    name: 'Board Member Onboarding',
    description: 'Workflow for onboarding new board members with training and document access',
    category: 'Governance',
    steps: 8,
    status: 'active',
    lastEdited: '2023-05-22T10:00:00Z',
    createdBy: 'Sarah Johnson'
  }
];

const CustomWorkflows = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Custom Workflows</h2>
        <Button>Create New Workflow</Button>
      </div>
      
      <div className="flex justify-between items-center">
        <Tabs defaultValue="all" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search workflows..." className="pl-8" />
        </div>
      </div>
      
      <ScrollArea className="h-[600px]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {customWorkflows.map((workflow) => (
            <Card key={workflow.id} className="flex flex-col h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge className={workflow.status === 'active' 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-800"
                  }>
                    {workflow.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge variant="outline">{workflow.category}</Badge>
                </div>
                <CardTitle className="text-xl">{workflow.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground mb-4">{workflow.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Steps:</span>
                    <span className="font-medium">{workflow.steps}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last edited:</span>
                    <span className="font-medium">{new Date(workflow.lastEdited).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created by:</span>
                    <span className="font-medium">{workflow.createdBy}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button variant="outline" size="sm">Duplicate</Button>
                <div className="space-x-2">
                  <Button variant="secondary" size="sm">Edit</Button>
                  <Button size="sm">Activate</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CustomWorkflows;
