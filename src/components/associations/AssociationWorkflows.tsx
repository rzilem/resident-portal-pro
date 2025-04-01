
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkflows } from '@/hooks/use-workflows';
import { useNavigate } from 'react-router-dom';
import { workflowEventService } from '@/services/calendar/workflowEventService';
import { toast } from 'sonner';
import { CalendarEvent } from '@/types/calendar';

// Date picker components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface AssociationWorkflowsProps {
  associationId: string;
}

const AssociationWorkflows: React.FC<AssociationWorkflowsProps> = ({ associationId }) => {
  const { activeWorkflows, isLoading } = useWorkflows({ associationId });
  const navigate = useNavigate();
  
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('');
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("12:00");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scheduledWorkflows, setScheduledWorkflows] = useState<CalendarEvent[]>([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(false);
  
  // Fetch scheduled workflows from the calendar
  useEffect(() => {
    const fetchScheduledWorkflows = async () => {
      setLoadingWorkflows(true);
      try {
        const workflows = await workflowEventService.getScheduledWorkflows(associationId);
        setScheduledWorkflows(workflows);
      } catch (error) {
        console.error('Error fetching scheduled workflows:', error);
        toast.error('Failed to load scheduled workflows');
      } finally {
        setLoadingWorkflows(false);
      }
    };
    
    fetchScheduledWorkflows();
  }, [associationId]);
  
  const handleScheduleWorkflow = async () => {
    if (!selectedWorkflow || !date) {
      toast.error('Please select a workflow and date');
      return;
    }
    
    // Combine date and time
    const [hours, minutes] = time.split(':').map(Number);
    const scheduledDate = new Date(date);
    scheduledDate.setHours(hours, minutes);
    
    try {
      // Find the workflow name
      const workflow = activeWorkflows.find(w => w.id === selectedWorkflow);
      const workflowName = workflow ? workflow.name : 'Selected Workflow';
      
      // Create calendar event for the workflow
      const newEvent = await workflowEventService.createWorkflowEvent(
        selectedWorkflow,
        `Run: ${workflowName}`,
        scheduledDate,
        associationId
      );
      
      // Update local state with the new workflow
      setScheduledWorkflows(prev => [...prev, newEvent]);
      
      toast.success(`Workflow scheduled for ${format(scheduledDate, 'PPp')}`);
      setDialogOpen(false);
      
      // Reset form
      setSelectedWorkflow('');
      setDate(undefined);
      setTime("12:00");
    } catch (error) {
      console.error('Error scheduling workflow:', error);
      toast.error('Failed to schedule workflow');
    }
  };
  
  const handleCancelWorkflow = async (eventId: string) => {
    if (window.confirm('Are you sure you want to cancel this scheduled workflow?')) {
      try {
        await workflowEventService.cancelScheduledWorkflow(eventId);
        // Remove the workflow from the local state
        setScheduledWorkflows(prev => prev.filter(w => w.id !== eventId));
        toast.success('Workflow cancelled successfully');
      } catch (error) {
        console.error('Error cancelling workflow:', error);
        toast.error('Failed to cancel workflow');
      }
    }
  };
  
  const handleRunWorkflow = async (eventId: string) => {
    try {
      await workflowEventService.executeScheduledWorkflow(eventId);
      // Update the workflow in the local state to show it's been executed
      setScheduledWorkflows(prev => 
        prev.map(w => w.id === eventId ? 
          { ...w, metadata: { executed: true, executed_at: new Date().toISOString() } } : w
        )
      );
      toast.success('Workflow executed successfully');
    } catch (error) {
      console.error('Error executing workflow:', error);
      toast.error('Failed to execute workflow');
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Association Workflows
        </CardTitle>
        <CardDescription>
          Schedule and manage automated workflows for this association
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium">Scheduled Workflows</h3>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Workflow
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule Workflow</DialogTitle>
                  <DialogDescription>
                    Select a workflow to schedule for this association
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="workflow">Select Workflow</Label>
                    <Select
                      value={selectedWorkflow}
                      onValueChange={setSelectedWorkflow}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a workflow" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeWorkflows.map((workflow) => (
                          <SelectItem key={workflow.id} value={workflow.id}>
                            {workflow.name}
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
                        <CalendarComponent
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
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleScheduleWorkflow}>
                    Schedule
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {isLoading || loadingWorkflows ? (
            <div className="text-center py-4">
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading workflows...</p>
            </div>
          ) : scheduledWorkflows.length > 0 ? (
            <div className="space-y-2">
              {scheduledWorkflows.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(event.start), 'PPp')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRunWorkflow(event.id)}
                    >
                      <Zap className="h-4 w-4" />
                      Run Now
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleCancelWorkflow(event.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Calendar className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>No scheduled workflows</p>
              <p className="text-sm">Schedule a workflow to automate your association tasks</p>
            </div>
          )}
          
          <div className="pt-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/workflows')}
            >
              <Zap className="mr-2 h-4 w-4" />
              Manage All Workflows
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssociationWorkflows;
