
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
  onSaveEvent: (data: any) => void;
}

const QuickEventDialog: React.FC<QuickEventDialogProps> = ({ 
  open, 
  onOpenChange, 
  date,
  onSaveEvent
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<CalendarEventType>('meeting');
  const [accessLevel, setAccessLevel] = useState<CalendarAccessLevel>('public');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveEvent({
      title,
      description,
      date: format(date, 'yyyy-MM-dd'),
      type: eventType,
      accessLevel
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setEventType('meeting');
    setAccessLevel('public');
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Event for {format(date, 'MMMM d, yyyy')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
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
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={eventType}
                onValueChange={(value) => setEventType(value as CalendarEventType)}
              >
                <SelectTrigger className="col-span-3" id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="social">Social Event</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="access" className="text-right">
                Visibility
              </Label>
              <Select 
                value={accessLevel}
                onValueChange={(value) => setAccessLevel(value as CalendarAccessLevel)}
              >
                <SelectTrigger className="col-span-3" id="access">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="homeowners">Homeowners Only</SelectItem>
                  <SelectItem value="board">Board Only</SelectItem>
                  <SelectItem value="management">Management Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">Add Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickEventDialog;
