
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, ChevronUp, ChevronDown, BarChart3, Clock, Activity } from "lucide-react";
import { useWorkflows } from '@/hooks/use-workflows';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Workflow } from '@/types/workflow';
import { useNavigate } from 'react-router-dom';

// Simulated execution metrics
const getRandomMetrics = (workflow: Workflow) => {
  return {
    executions: Math.floor(Math.random() * 100) + 1,
    success: Math.floor(Math.random() * 95) + 5,
    lastRun: new Date(Date.now() - Math.floor(Math.random() * 7 * 86400000))
  };
};

const ActiveWorkflows = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { activeWorkflows, isLoading } = useWorkflows();
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  
  // Filter workflows by search and category
  const filteredWorkflows = activeWorkflows.filter(workflow => {
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        workflow.name.toLowerCase().includes(term) ||
        workflow.description.toLowerCase().includes(term) ||
        workflow.category.toLowerCase().includes(term)
      );
    }
    
    // Filter by category tab
    if (activeTab !== 'all') {
      return workflow.category.toLowerCase() === activeTab.toLowerCase();
    }
    
    return true;
  });

  // Get unique categories
  const categories = ['all', ...new Set(activeWorkflows.map(w => w.category.toLowerCase()))];

  // Function to view workflow details
  const viewWorkflowDetails = (id: string) => {
    navigate(`/workflows?tab=builder&id=${id}&readonly=true`);
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
        <h2 className="text-2xl font-semibold">Active Workflows</h2>
        <div className="relative w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search workflows..." 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <ScrollArea className="h-[600px]">
        {filteredWorkflows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredWorkflows.map(workflow => {
              const metrics = getRandomMetrics(workflow);
              
              return (
                <Card key={workflow.id} className="overflow-hidden flex flex-col h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                      <Badge variant="outline">{workflow.category}</Badge>
                    </div>
                    <CardTitle className="text-xl">{workflow.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground mb-4 line-clamp-2">{workflow.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="flex flex-col items-center p-2 border rounded-md">
                        <Activity className="h-4 w-4 text-muted-foreground mb-1" />
                        <span className="text-lg font-semibold">{metrics.executions}</span>
                        <span className="text-xs text-muted-foreground">Executions</span>
                      </div>
                      <div className="flex flex-col items-center p-2 border rounded-md">
                        <BarChart3 className="h-4 w-4 text-muted-foreground mb-1" />
                        <span className="text-lg font-semibold">{metrics.success}%</span>
                        <span className="text-xs text-muted-foreground">Success Rate</span>
                      </div>
                      <div className="flex flex-col items-center p-2 border rounded-md">
                        <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                        <span className="text-lg font-semibold">{metrics.lastRun.toLocaleDateString()}</span>
                        <span className="text-xs text-muted-foreground">Last Run</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Execution History</div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${metrics.success}%` }} 
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <ChevronUp className="h-3 w-3 text-green-500 mr-1" />
                          <span>{Math.floor(metrics.executions * metrics.success / 100)} successful</span>
                        </div>
                        <div className="flex items-center">
                          <ChevronDown className="h-3 w-3 text-red-500 mr-1" />
                          <span>{metrics.executions - Math.floor(metrics.executions * metrics.success / 100)} failed</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <div className="p-4 border-t flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {workflow.steps.length} steps
                    </span>
                    <Button variant="outline" size="sm" onClick={() => viewWorkflowDetails(workflow.id)}>
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No active workflows found.</p>
            <Button className="mt-4" onClick={() => navigate('/workflows?tab=templates')}>
              Create from Template
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ActiveWorkflows;
