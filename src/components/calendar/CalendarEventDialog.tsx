import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarEvent, CalendarEventType, CalendarAccessLevel } from '@/types/calendar';
import { format } from 'date-fns';

interface CalendarEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  event?: CalendarEvent;
  associationId?: string;
  userAccessLevel: CalendarAccessLevel;
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

const CalendarEventDialog = ({ 
  open, 
  onOpenChange, 
  onSave, 
  event, 
  associationId,
  userAccessLevel
}: CalendarEventDialogProps) => {
  const [formData, setFormData] = useState<Omit<CalendarEvent, 'id'>>({
    title: event?.title || '',
    description: event?.description || '',
    start: event?.start || new Date(),
    end: event?.end,
    allDay: event?.allDay || false,
    location: event?.location || '',
    type: event?.type || 'meeting',
    associationId: event?.associationId || associationId,
    accessLevel: event?.accessLevel || 'residents',
    color: event?.color || eventColors.meeting
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    if (name === 'type') {
      // Update color based on type
      setFormData(prev => ({ 
        ...prev, 
        [name]: value as CalendarEventType,
        color: eventColors[value as CalendarEventType]
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleAllDayChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, allDay: checked }));
  };
  
  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };
  
  // Only allow higher or equal access levels based on user's level
  const allowedAccessLevels: Record<CalendarAccessLevel, CalendarAccessLevel[]> = {
    public: ['public'],
    residents: ['public', 'residents'],
    committee: ['public', 'residents', 'committee'],
    board: ['public', 'residents', 'committee', 'board'],
    admin: ['public', 'residents', 'committee', 'board', 'admin']
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Create New Event'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Event Type</Label>
              <Select
                value={formData.type}
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
                  <SelectItem value="workflow">Workflow</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accessLevel">Access Level</Label>
              <Select
                value={formData.accessLevel}
                onValueChange={(value) => handleSelectChange('accessLevel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
                <SelectContent>
                  {allowedAccessLevels[userAccessLevel].map(level => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="allDay" 
                checked={formData.allDay}
                onCheckedChange={handleAllDayChange}
              />
              <Label htmlFor="allDay">All Day Event</Label>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={typeof formData.start === 'string' 
                  ? formData.start.split('T')[0] 
                  : format(formData.start, 'yyyy-MM-dd')}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setFormData(prev => ({ ...prev, start: date }));
                }}
              />
            </div>
            
            {!formData.allDay && (
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={typeof formData.start === 'string'
                    ? formData.start.split('T')[1].substring(0, 5)
                    : format(formData.start, 'HH:mm')}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':');
                    const startDate = typeof formData.start === 'string'
                      ? new Date(formData.start)
                      : new Date(formData.start);
                    
                    startDate.setHours(parseInt(hours), parseInt(minutes));
                    setFormData(prev => ({ ...prev, start: startDate }));
                  }}
                />
              </div>
            )}
          </div>
          
          {!formData.allDay && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.end 
                    ? (typeof formData.end === 'string' 
                      ? formData.end.split('T')[0] 
                      : format(formData.end, 'yyyy-MM-dd'))
                    : (typeof formData.start === 'string' 
                      ? formData.start.split('T')[0] 
                      : format(formData.start, 'yyyy-MM-dd'))
                  }
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    if (!formData.end) {
                      // If no end time, use the start time
                      const startTime = typeof formData.start === 'string'
                        ? new Date(formData.start)
                        : new Date(formData.start);
                      
                      date.setHours(startTime.getHours(), startTime.getMinutes());
                    } else {
                      // Keep the existing end time
                      const endTime = typeof formData.end === 'string'
                        ? new Date(formData.end)
                        : new Date(formData.end);
                      
                      date.setHours(endTime.getHours(), endTime.getMinutes());
                    }
                    
                    setFormData(prev => ({ ...prev, end: date }));
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.end
                    ? (typeof formData.end === 'string'
                      ? formData.end.split('T')[1].substring(0, 5)
                      : format(formData.end, 'HH:mm'))
                    : (typeof formData.start === 'string'
                      ? formData.start.split('T')[1].substring(0, 5)
                      : format(new Date(
                          (typeof formData.start === 'string' 
                            ? new Date(formData.start) 
                            : formData.start).getTime() + 60 * 60 * 1000
                        ), 'HH:mm'))
                  }
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':');
                    
                    // Use the end date if it exists, otherwise use the start date
                    const endDate = formData.end
                      ? (typeof formData.end === 'string'
                        ? new Date(formData.end)
                        : new Date(formData.end))
                      : (typeof formData.start === 'string'
                        ? new Date(formData.start)
                        : new Date(formData.start));
                    
                    endDate.setHours(parseInt(hours), parseInt(minutes));
                    setFormData(prev => ({ ...prev, end: endDate }));
                  }}
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>
            {event ? 'Update' : 'Create'} Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarEventDialog;
