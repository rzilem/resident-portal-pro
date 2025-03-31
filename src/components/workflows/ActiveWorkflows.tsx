import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ExternalLink, Clock, Calendar as CalendarIcon, Zap, X, PlayCircle, PauseCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useWorkflows } from '@/hooks/use-workflows';
import { useNavigate } from 'react-router-dom';
import { getTemplateIcon } from '@/data/workflowTemplates';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { workflowEventService } from '@/services/calendar/workflowEventService';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

const ActiveWorkflows = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssociation, setSelectedAssociation] = useState<string>('');
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("12:00");
  const [schedulingWorkflow, setSchedulingWorkflow] = useState<string | null>(null);
  
  const { 
    activeWorkflows, 
    isLoading, 
    toggleWorkflowStatus 
  } = useWorkflows();
  
  const navigate = useNavigate();

  const associations = [
    { id: 'assoc1', name: 'Sunset Park Homeowners Association' },
    { id: 'assoc2', name: 'Mountain View Condominiums' },
    { id: 'assoc3', name: 'Lakeside Community HOA' },
    { id: 'assoc4', name: 'Riverside Estates' }
  ];

  const filteredWorkflows = activeWorkflows.filter(workflow => {
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

  const handleViewWorkflow = (id: string) => {
    navigate(`/workflows?tab=builder&id=${id}&readonly=true`);
  };

  const handleEditWorkflow = (id: string) => {
    navigate(`/workflows?tab=builder&id=${id}`);
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleWorkflowStatus(id);
    } catch (error) {
      console.error('Error toggling workflow status:', error);
    }
  };

  const handleScheduleWorkflow = async (workflowId: string) => {
    if (!selectedAssociation || !date) {
      toast.error('Please select an association and date');
      return;
    }
    
    const [hours, minutes] = time.split(':').map(Number);
    const scheduledDate = new Date(date);
    scheduledDate.setHours(hours, minutes);
    
    try {
      const workflow = activeWorkflows.find(w => w.id === workflowId);
      const workflowName = workflow ? workflow.name : 'Selected Workflow';
      
      await workflowEventService.createWorkflowEvent(
        workflowId,
        `Run: ${workflowName}`,
        scheduledDate,
        selectedAssociation
      );
      
      toast.success(`Workflow scheduled for ${format(scheduledDate, 'PPp')}`);
      setSchedulingWorkflow(null);
      
      setSelectedAssociation('');
      setDate(undefined);
      setTime("12:00");
    } catch (error) {
      console.error('Error scheduling workflow:', error);
      toast.error('Failed to schedule workflow');
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
        <h2 className="text-2xl font-semibold">Active Workflows</h2>
        <Button onClick={() => navigate('/workflows?tab=templates')}>Add New Workflow</Button>
      </div>
      
      <div className="flex justify-between items-center">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="all">All Active</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="running">Running</TabsTrigger>
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
                    <div className="p-2 rounded-md bg-muted">
                      {getTemplateIcon({
                        id: workflow.id,
                        title: workflow.name,
                        description: workflow.description,
                        category: workflow.category,
                        steps: workflow.steps.length
                      })}
                    </div>
                    <Badge 
                      variant="outline" 
                      className="bg-green-100 text-green-800 hover:bg-green-200"
                    >
                      Active
                    </Badge>
                  </div>
                  <CardTitle className="mt-4">{workflow.name}</CardTitle>
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
                  
                  <div className="mt-3 text-sm flex items-center text-muted-foreground">
                    <Zap className="h-3.5 w-3.5 mr-1" />
                    <span>{workflow.steps.length} steps</span>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-2 grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewWorkflow(workflow.id)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        onClick={() => setSchedulingWorkflow(workflow.id)}
                      >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Schedule
                      </Button>
                    </DialogTrigger>
                    
                    {schedulingWorkflow === workflow.id && (
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Schedule Workflow: {workflow.name}</DialogTitle>
                          <DialogDescription>
                            Set when this workflow should run
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="association">Select Association</Label>
                            <Select
                              value={selectedAssociation}
                              onValueChange={setSelectedAssociation}
                            >
                              <SelectTrigger id="association">
                                <SelectValue placeholder="Select an association" />
                              </SelectTrigger>
                              <SelectContent>
                                {associations.map((association) => (
                                  <SelectItem key={association.id} value={association.id}>
                                    {association.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {date ? format(date, "PPP") : "Select a date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={date}
                                  onSelect={setDate}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Time</Label>
                            <Select value={time} onValueChange={setTime}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 24 }).map((_, hour) => (
                                  <React.Fragment key={hour}>
                                    <SelectItem value={`${hour.toString().padStart(2, '0')}:00`}>
                                      {hour.toString().padStart(2, '0')}:00
                                    </SelectItem>
                                    <SelectItem value={`${hour.toString().padStart(2, '0')}:30`}>
                                      {hour.toString().padStart(2, '0')}:30
                                    </SelectItem>
                                  </React.Fragment>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button 
                            variant="outline" 
                            onClick={() => setSchedulingWorkflow(null)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={() => handleScheduleWorkflow(workflow.id)}
                          >
                            Schedule
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditWorkflow(workflow.id)}
                    className="col-span-1"
                  >
                    Edit
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="col-span-1"
                    onClick={() => handleToggleStatus(workflow.id)}
                  >
                    <PauseCircle className="h-4 w-4 mr-2" />
                    Deactivate
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Zap className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No active workflows</h3>
              <p className="text-muted-foreground mb-6">
                Activate existing workflows or create new ones from templates
              </p>
              <Button onClick={() => navigate('/workflows?tab=templates')}>
                Browse Templates
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ActiveWorkflows;
