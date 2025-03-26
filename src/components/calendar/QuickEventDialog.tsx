
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Workflow } from "lucide-react";
import { CalendarEvent } from "@/types/calendar";
import { Workflow as WorkflowType } from "@/types/workflow";
import { format } from "date-fns";

interface QuickEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
  onSaveEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onScheduleWorkflow: (workflowId: string, title: string, start: Date) => void;
  associationId?: string;
  userAccessLevel: string;
  workflows: WorkflowType[];
}

const QuickEventDialog = ({
  open,
  onOpenChange,
  date,
  onSaveEvent,
  onScheduleWorkflow,
  associationId,
  userAccessLevel,
  workflows
}: QuickEventDialogProps) => {
  const [activeTab, setActiveTab] = useState('event');
  
  // Event form state
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('meeting');
  const [eventAccess, setEventAccess] = useState('residents');
  
  // Workflow form state
  const [selectedWorkflow, setSelectedWorkflow] = useState('');
  const [workflowTitle, setWorkflowTitle] = useState('');
  
  const activeWorkflows = workflows.filter(w => w.status === 'active');
  
  const handleSaveEvent = () => {
    if (!eventTitle.trim()) return;
    
    onSaveEvent({
      title: eventTitle,
      description: eventDescription,
      start: date,
      type: eventType as any,
      accessLevel: eventAccess as any,
      associationId: associationId
    });
    
    resetForm();
    onOpenChange(false);
  };
  
  const handleScheduleWorkflow = () => {
    if (!selectedWorkflow || !workflowTitle.trim()) return;
    
    onScheduleWorkflow(selectedWorkflow, workflowTitle, date);
    
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    setEventTitle('');
    setEventDescription('');
    setEventType('meeting');
    setEventAccess('residents');
    setSelectedWorkflow('');
    setWorkflowTitle('');
    setActiveTab('event');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Add for {format(date, "MMMM d, yyyy")}
          </DialogTitle>
          <DialogDescription>
            Quickly add an event or schedule a workflow
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="event" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Add Event</span>
            </TabsTrigger>
            <TabsTrigger value="workflow" className="flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              <span>Schedule Workflow</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="event" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input 
                id="title" 
                placeholder="Enter event title" 
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input 
                id="description" 
                placeholder="Enter event description" 
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventType">Event Type</Label>
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger id="eventType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="holiday">Holiday</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eventAccess">Visibility</Label>
                <Select value={eventAccess} onValueChange={setEventAccess}>
                  <SelectTrigger id="eventAccess">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="residents">Residents Only</SelectItem>
                    <SelectItem value="board">Board Only</SelectItem>
                    <SelectItem value="admin">Admin Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="workflow" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="workflow">Select Workflow</Label>
              <Select 
                value={selectedWorkflow} 
                onValueChange={setSelectedWorkflow}
              >
                <SelectTrigger id="workflow">
                  <SelectValue placeholder="Select a workflow to schedule" />
                </SelectTrigger>
                <SelectContent>
                  {activeWorkflows.length > 0 ? (
                    activeWorkflows.map((workflow) => (
                      <SelectItem key={workflow.id} value={workflow.id}>
                        {workflow.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No active workflows available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workflowTitle">Scheduled Title</Label>
              <Input 
                id="workflowTitle" 
                placeholder="Enter a title for this scheduled workflow" 
                value={workflowTitle}
                onChange={(e) => setWorkflowTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workflowDate">Date & Time</Label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground border p-2 rounded-md">
                <Calendar className="h-4 w-4" />
                <span>{format(date, "MMMM d, yyyy")}</span>
                <Clock className="h-4 w-4 ml-2" />
                <span>{format(date, "h:mm a")}</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {activeTab === 'event' ? (
            <Button onClick={handleSaveEvent} disabled={!eventTitle.trim()}>
              Add Event
            </Button>
          ) : (
            <Button 
              onClick={handleScheduleWorkflow} 
              disabled={!selectedWorkflow || !workflowTitle.trim()}
            >
              Schedule Workflow
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickEventDialog;
