
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
  AlertDialogTrigger
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
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'}>
                      {workflow.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="py-2 flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {workflow.description || 'No description provided'}
                  </p>
                  
                  {workflow.category && (
                    <Badge variant="outline" className="mt-2">
                      {workflow.category}
                    </Badge>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleToggleStatus(workflow.id)}
                      title={workflow.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {workflow.status === 'active' ? (
                        <X className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Check className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDuplicateWorkflow(workflow.id)}
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setWorkflowToDelete(workflow.id)}
                          title="Delete"
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      
                      {workflowToDelete === workflow.id && (
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the workflow "{workflow.name}".
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setWorkflowToDelete(null)}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteWorkflow(workflow.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      )}
                    </AlertDialog>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditWorkflow(workflow.id)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No workflows found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm 
                  ? `No results for "${searchTerm}"`
                  : 'Create custom workflows to automate your processes'}
              </p>
              <Button onClick={() => navigate('/workflows?tab=builder')}>
                Create New Workflow
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CustomWorkflows;
