
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Switch } from '@/components/ui/switch';
import { CalendarAccessLevel, CalendarEventType, CalendarEvent } from '@/types/calendar';
import { Association } from '@/types/association';

const EVENT_TYPES = [
  { value: 'meeting', label: 'Meeting' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'community', label: 'Community Event' },
  { value: 'custom', label: 'Custom' }
];

const ACCESS_LEVELS = [
  { value: 'public', label: 'Public' },
  { value: 'residents', label: 'Residents Only' },
  { value: 'committee', label: 'Committee Members' },
  { value: 'board', label: 'Board Members Only' },
  { value: 'admin', label: 'Administrators Only' }
];

interface CalendarEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (eventData: any) => void;
  associationId?: string;
  userAccessLevel: CalendarAccessLevel;
  isGlobalView?: boolean;
  associations?: Association[];
  editEvent?: CalendarEvent; // Add this prop to support editing events
}

const CalendarEventDialog: React.FC<CalendarEventDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  associationId,
  userAccessLevel,
  isGlobalView = false,
  associations = [],
  editEvent
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [eventType, setEventType] = useState<CalendarEventType>('meeting');
  const [accessLevel, setAccessLevel] = useState<CalendarAccessLevel>(userAccessLevel);
  const [allDay, setAllDay] = useState(false);
  const [selectedAssociationId, setSelectedAssociationId] = useState<string | undefined>(associationId);

  // Populate form with event data when editing
  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title);
      setDescription(editEvent.description || '');
      setLocation(editEvent.location || '');
      setStartDate(typeof editEvent.start === 'string' ? new Date(editEvent.start) : editEvent.start);
      
      if (editEvent.end) {
        setEndDate(typeof editEvent.end === 'string' ? new Date(editEvent.end) : editEvent.end);
      }
      
      setEventType(editEvent.type);
      setAccessLevel(editEvent.accessLevel);
      setAllDay(editEvent.allDay || false);
      setSelectedAssociationId(editEvent.associationId);
    }
  }, [editEvent]);

  const handleSave = () => {
    if (!title || !startDate) {
      // Basic validation
      alert('Please enter a title and start date');
      return;
    }

    const eventData = {
      title,
      description,
      location,
      start: startDate,
      end: endDate,
      type: eventType,
      accessLevel,
      allDay,
      associationId: selectedAssociationId || associationId
    };

    console.log("Saving event:", eventData);
    onSave(eventData);
    onOpenChange(false);
    
    // Reset form if not editing
    if (!editEvent) {
      setTitle('');
      setDescription('');
      setLocation('');
      setStartDate(new Date());
      setEndDate(undefined);
      setEventType('meeting');
      setAccessLevel(userAccessLevel);
      setAllDay(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{editEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          {isGlobalView && associations.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="association" className="text-right">
                Association
              </Label>
              <Select
                value={selectedAssociationId}
                onValueChange={(value) => setSelectedAssociationId(value)}
              >
                <SelectTrigger className="col-span-3">
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
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start-date" className="text-right">
              Start Date
            </Label>
            <div className="col-span-3">
              <DatePicker
                date={startDate}
                onDateChange={setStartDate}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end-date" className="text-right">
              End Date
            </Label>
            <div className="col-span-3">
              <DatePicker
                date={endDate}
                onDateChange={setEndDate}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="all-day" className="text-right">
              All Day
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                checked={allDay}
                onCheckedChange={setAllDay}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="event-type" className="text-right">
              Event Type
            </Label>
            <Select
              value={eventType}
              onValueChange={(value) => setEventType(value as CalendarEventType)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="access-level" className="text-right">
              Access Level
            </Label>
            <Select
              value={accessLevel}
              onValueChange={(value) => setAccessLevel(value as CalendarAccessLevel)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select access level" />
              </SelectTrigger>
              <SelectContent>
                {ACCESS_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>
            {editEvent ? 'Update Event' : 'Save Event'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarEventDialog;
