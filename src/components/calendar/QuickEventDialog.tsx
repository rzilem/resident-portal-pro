
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { CalendarEvent, CalendarEventType, CalendarAccessLevel } from '@/types/calendar';
import { Workflow } from '@/types/workflow';

interface QuickEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
  onSaveEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onScheduleWorkflow?: (workflowId: string, title: string, start: Date) => void;
  associationId?: string;
  userAccessLevel: CalendarAccessLevel;
  workflows?: Workflow[];
}

const eventColors: Record<CalendarEventType, string> = {
  meeting: '#4f46e5',
  maintenance: '#f59e0b',
  holiday: '#ef4444',
  deadline: '#6366f1',
  workflow: '#8b5cf6',
  community: '#10b981',
  custom: '#6b7280'
};

const QuickEventDialog = ({ 
  open, 
  onOpenChange, 
  date,
  onSaveEvent,
  onScheduleWorkflow,
  associationId,
  userAccessLevel,
  workflows = []
}: QuickEventDialogProps) => {
  const [activeTab, setActiveTab] = useState('event');
  
  // Event form state
  const [eventForm, setEventForm] = useState<Omit<CalendarEvent, 'id'>>({
    title: '',
    description: '',
    start: date,
    end: new Date(date.getTime() + 60 * 60 * 1000), // Default 1 hour duration
    allDay: false,
    type: 'meeting',
    associationId: associationId,
    accessLevel: 'residents',
    color: eventColors.meeting
  });
  
  // Workflow form state
  const [workflowForm, setWorkflowForm] = useState({
    workflowId: '',
    title: '',
    date: date
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    if (name === 'type') {
      // Update color based on event type
      setEventForm(prev => ({ 
        ...prev, 
        [name]: value as CalendarEventType,
        color: eventColors[value as CalendarEventType]
      }));
    } else {
      setEventForm(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleAllDayChange = (checked: boolean) => {
    setEventForm(prev => ({ ...prev, allDay: checked }));
  };
  
  const handleWorkflowChange = (name: string, value: string) => {
    setWorkflowForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveEvent = () => {
    onSaveEvent(eventForm);
    onOpenChange(false);
  };
  
  const handleScheduleWorkflow = () => {
    if (onScheduleWorkflow && workflowForm.workflowId && workflowForm.title) {
      onScheduleWorkflow(workflowForm.workflowId, workflowForm.title, workflowForm.date);
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" /> 
            {format(date, 'EEEE, MMMM d, yyyy')}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="event">Create Event</TabsTrigger>
            <TabsTrigger value="workflow" disabled={!onScheduleWorkflow}>Schedule Workflow</TabsTrigger>
          </TabsList>
          
          {/* Event Tab */}
          <TabsContent value="event" className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={eventForm.title}
                  onChange={handleInputChange}
                  placeholder="Enter event title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Event Type</Label>
                <Select
                  value={eventForm.type}
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
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
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="allDay" 
                    checked={eventForm.allDay}
                    onCheckedChange={handleAllDayChange}
                  />
                  <Label htmlFor="allDay">All Day Event</Label>
                </div>
              </div>
              
              {!eventForm.allDay && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <div className="relative">
                      <Input
                        id="startTime"
                        name="startTime"
                        type="time"
                        value={format(eventForm.start, 'HH:mm')}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':');
                          const newStart = new Date(date);
                          newStart.setHours(parseInt(hours), parseInt(minutes));
                          setEventForm(prev => ({ ...prev, start: newStart }));
                        }}
                      />
                      <Clock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <div className="relative">
                      <Input
                        id="endTime"
                        name="endTime"
                        type="time"
                        value={eventForm.end ? format(eventForm.end, 'HH:mm') : ''}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':');
                          const newEnd = new Date(date);
                          newEnd.setHours(parseInt(hours), parseInt(minutes));
                          setEventForm(prev => ({ ...prev, end: newEnd }));
                        }}
                      />
                      <Clock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={eventForm.description || ''}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Enter event description"
                />
              </div>
            </div>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEvent} disabled={!eventForm.title}>
                Create Event
              </Button>
            </DialogFooter>
          </TabsContent>
          
          {/* Workflow Tab */}
          <TabsContent value="workflow" className="space-y-4">
            {workflows.length > 0 ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="workflowId">Select Workflow</Label>
                  <Select
                    value={workflowForm.workflowId}
                    onValueChange={(value) => handleWorkflowChange('workflowId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a workflow" />
                    </SelectTrigger>
                    <SelectContent>
                      {workflows.map(workflow => (
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
                    value={workflowForm.title}
                    onChange={(e) => handleWorkflowChange('title', e.target.value)}
                    placeholder="Enter a title for this scheduled workflow"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="workflowTime">Time</Label>
                  <div className="relative">
                    <Input
                      id="workflowTime"
                      type="time"
                      value={format(workflowForm.date, 'HH:mm')}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(':');
                        const newDate = new Date(date);
                        newDate.setHours(parseInt(hours), parseInt(minutes));
                        setWorkflowForm(prev => ({ ...prev, date: newDate }));
                      }}
                    />
                    <Clock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No workflows available to schedule.</p>
                <p className="text-sm text-muted-foreground mt-1">Create workflows in the Workflows section first.</p>
              </div>
            )}
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleScheduleWorkflow} 
                disabled={!workflowForm.workflowId || !workflowForm.title || workflows.length === 0}
              >
                Schedule Workflow
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default QuickEventDialog;
