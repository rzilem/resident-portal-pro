
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { CalendarAccessLevel, CalendarEventType } from '@/types/calendar';

interface QuickEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
  onSaveEvent: (event: any) => void;
  onScheduleWorkflow: (workflowId: string, title: string, start: Date) => Promise<any>;
  associationId?: string;
  userAccessLevel: CalendarAccessLevel;
  workflows: any[];
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
  const [activeTab, setActiveTab] = useState<string>('event');
  const [title, setTitle] = useState<string>('');
  const [allDay, setAllDay] = useState<boolean>(false);
  const [eventType, setEventType] = useState<CalendarEventType>('meeting');
  const [workflowId, setWorkflowId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const handleSaveEvent = () => {
    if (!title.trim()) return;
    
    const newEvent = {
      title,
      description: '',
      start: date,
      allDay,
      type: eventType,
      associationId,
      accessLevel: userAccessLevel === 'admin' ? 'residents' : 'public' as CalendarAccessLevel,
    };
    
    onSaveEvent(newEvent);
    onOpenChange(false);
  };
  
  const handleScheduleWorkflow = async () => {
    if (!workflowId || !title.trim()) return;
    
    setLoading(true);
    try {
      await onScheduleWorkflow(workflowId, title, date);
      onOpenChange(false);
    } catch (error) {
      console.error('Error scheduling workflow:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add for {format(date, 'MMMM d, yyyy')}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="event">Quick Event</TabsTrigger>
            <TabsTrigger value="workflow" disabled={workflows.length === 0 || !associationId}>
              Schedule Workflow
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="event" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Date</Label>
                <div className="flex items-center h-10 px-3 border rounded-md bg-muted/50">
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                  <span>{format(date, 'PPP')}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eventType">Event Type</Label>
                <Select value={eventType} onValueChange={(value) => setEventType(value as CalendarEventType)}>
                  <SelectTrigger id="eventType">
                    <SelectValue placeholder="Select type" />
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
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="allDay" 
                checked={allDay} 
                onCheckedChange={setAllDay} 
              />
              <Label htmlFor="allDay">All day event</Label>
            </div>
          </TabsContent>
          
          <TabsContent value="workflow" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workflowId">Select Workflow</Label>
              <Select value={workflowId} onValueChange={setWorkflowId}>
                <SelectTrigger id="workflowId">
                  <SelectValue placeholder="Select workflow" />
                </SelectTrigger>
                <SelectContent>
                  {workflows.map((workflow) => (
                    <SelectItem key={workflow.id} value={workflow.id}>
                      {workflow.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workflowTitle">Title</Label>
              <Input
                id="workflowTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter workflow title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workflowDate">Start Date</Label>
              <div className="flex items-center h-10 px-3 border rounded-md bg-muted/50">
                <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                <span>{format(date, 'PPP')}</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {activeTab === 'event' ? (
            <Button onClick={handleSaveEvent} disabled={!title.trim()}>
              Add Event
            </Button>
          ) : (
            <Button 
              onClick={handleScheduleWorkflow} 
              disabled={loading || !workflowId || !title.trim()}
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
