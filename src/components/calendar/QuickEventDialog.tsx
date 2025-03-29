
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { CalendarAccessLevel, CalendarEventType } from '@/types/calendar';

interface QuickEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
  onSaveEvent: (event: any) => void;
  onScheduleWorkflow: (workflowId: string, title: string, date: Date) => void;
  associationId?: string;
  userAccessLevel: CalendarAccessLevel;
  workflows: any[]; // This would be properly typed in a real app
}

const QuickEventDialog: React.FC<QuickEventDialogProps> = ({
  open,
  onOpenChange,
  date,
  onSaveEvent,
  onScheduleWorkflow,
  associationId,
  userAccessLevel,
  workflows
}) => {
  const [activeTab, setActiveTab] = useState<'event' | 'workflow'>('event');
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<CalendarEventType>('meeting');
  const [workflowId, setWorkflowId] = useState('');
  
  const handleCreateEvent = () => {
    if (!title.trim()) return;
    
    const newEvent = {
      title,
      description: '',
      start: date,
      allDay: true,
      type: eventType,
      associationId,
      accessLevel: userAccessLevel === 'admin' ? 'residents' as CalendarAccessLevel : 'public' as CalendarAccessLevel,
    };
    
    onSaveEvent(newEvent);
    onOpenChange(false);
    
    // Reset form
    setTitle('');
    setEventType('meeting');
  };
  
  const handleScheduleWorkflow = () => {
    if (!workflowId || !title.trim() || !associationId) return;
    
    onScheduleWorkflow(workflowId, title, date);
    onOpenChange(false);
    
    // Reset form
    setTitle('');
    setWorkflowId('');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quick Add for {format(date, 'MMMM d, yyyy')}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'event' | 'workflow')}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="event">Event</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
          </TabsList>
          
          <TabsContent value="event" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type</Label>
              <Select value={eventType} onValueChange={(value) => setEventType(value as CalendarEventType)}>
                <SelectTrigger id="eventType">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="workflow" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="workflowTitle">Workflow Title</Label>
              <Input
                id="workflowTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter workflow title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workflow">Select Workflow</Label>
              <Select value={workflowId} onValueChange={setWorkflowId}>
                <SelectTrigger id="workflow">
                  <SelectValue placeholder="Select a workflow" />
                </SelectTrigger>
                <SelectContent>
                  {workflows.length > 0 ? (
                    workflows.map((workflow) => (
                      <SelectItem key={workflow.id} value={workflow.id}>
                        {workflow.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>No workflows available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={activeTab === 'event' ? handleCreateEvent : handleScheduleWorkflow}
            disabled={
              !title.trim() || 
              (activeTab === 'workflow' && !workflowId)
            }
          >
            {activeTab === 'event' ? 'Add Event' : 'Schedule Workflow'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuickEventDialog;
