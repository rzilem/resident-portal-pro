
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Edit, Copy, Trash, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useWorkflows } from '@/hooks/use-workflows';
import { useNavigate } from 'react-router-dom';
import { getTemplateIcon } from '@/data/workflowTemplates';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CustomWorkflows = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [workflowToDelete, setWorkflowToDelete] = useState<string | null>(null);
  
  const { 
    workflows, 
    isLoading, 
    toggleWorkflowStatus, 
    duplicateWorkflow, 
    deleteWorkflow 
  } = useWorkflows();
  
  const navigate = useNavigate();

  // Filter workflows based on selected tab and search term
  const filteredWorkflows = workflows.filter(workflow => {
    // Filter by tab
    if (selectedTab === 'active' && workflow.status !== 'active') return false;
    if (selectedTab === 'inactive' && workflow.status !== 'inactive') return false;
    if (selectedTab === 'templates' && !workflow.name.toLowerCase().includes('template')) return false;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        workflow.name.toLowerCase().includes(term) ||
        workflow.description.toLowerCase().includes(term) ||
        workflow.category.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  const handleEditWorkflow = (id: string) => {
    navigate(`/workflows?tab=builder&id=${id}`);
  };

  const handleDuplicateWorkflow = async (id: string) => {
    try {
      await duplicateWorkflow(id);
    } catch (error) {
      console.error('Error duplicating workflow:', error);
    }
  };

  const handleDeleteWorkflow = async (id: string) => {
    try {
      await deleteWorkflow(id);
      setWorkflowToDelete(null);
    } catch (error) {
      console.error('Error deleting workflow:', error);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleWorkflowStatus(id);
    } catch (error) {
      console.error('Error toggling workflow status:', error);
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
        <h2 className="text-2xl font-semibold">Custom Workflows</h2>
        <Button onClick={() => navigate('/workflows?tab=builder')}>Create New Workflow</Button>
      </div>
      
      <div className="flex justify-between items-center">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
        </Tabs>
        
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
      
      <ScrollArea className="h-[600px]">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredWorkflows.length > 0 ? (
            filteredWorkflows.map((workflow) => (
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
                      <span className="font-medium">{workflow.steps.length}</span>
                    </div>
                    {workflow.lastEditedAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last edited:</span>
                        <span className="font-medium">{new Date(workflow.lastEditedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    {workflow.createdBy && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created by:</span>
                        <span className="font-medium">{workflow.createdBy}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleDuplicateWorkflow(workflow.id)}>
                    <Copy className="mr-1 h-4 w-4" />
                    Duplicate
                  </Button>
                  <div className="space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setWorkflowToDelete(workflow.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditWorkflow(workflow.id)}>
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button 
                      size="sm"
                      variant={workflow.status === 'active' ? 'destructive' : 'default'}
                      onClick={() => handleToggleStatus(workflow.id)}
                    >
                      {workflow.status === 'active' ? (
                        <><X className="mr-1 h-4 w-4" /> Deactivate</>
                      ) : (
                        <><Check className="mr-1 h-4 w-4" /> Activate</>
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No workflows found. Create your first workflow.</p>
              <Button className="mt-4" onClick={() => navigate('/workflows?tab=builder')}>
                Create New Workflow
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      <AlertDialog open={!!workflowToDelete} onOpenChange={(open) => !open && setWorkflowToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the workflow
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => workflowToDelete && handleDeleteWorkflow(workflowToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomWorkflows;
