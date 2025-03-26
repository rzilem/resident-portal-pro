import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarEvent, CalendarAccessLevel } from '@/types/calendar';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, MapPin, Users, Tag, Globe, Trash, Edit, CalendarOff } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EventDetailsProps {
  event: CalendarEvent;
  onClose: () => void;
  onEdit: (event: Partial<CalendarEvent>) => void;
  onDelete: () => void;
  userAccessLevel: CalendarAccessLevel;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  onClose,
  onEdit,
  onDelete,
  userAccessLevel
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const formatEventDateTime = (event: CalendarEvent) => {
    const start = typeof event.start === 'string' ? parseISO(event.start) : event.start;
    
    if (event.allDay) {
      return 'All Day';
    }
    
    let dateTimeString = format(start, 'EEEE, MMMM d, yyyy');
    dateTimeString += ' at ' + format(start, 'h:mm a');
    
    if (event.end) {
      const end = typeof event.end === 'string' ? parseISO(event.end) : event.end;
      dateTimeString += ` to ${format(end, 'h:mm a')}`;
    }
    
    return dateTimeString;
  };
  
  const canEditEvent = () => {
    // If user is admin, they can edit any event
    if (userAccessLevel === 'admin') return true;
    
    // Otherwise, check access levels
    const accessLevels: Record<CalendarAccessLevel, CalendarAccessLevel[]> = {
      'public': [],
      'residents': [],
      'committee': ['committee', 'board', 'admin'],
      'board': ['board', 'admin'],
      'admin': ['admin']
    };
    
    return accessLevels[event.accessLevel]?.includes(userAccessLevel) || false;
  };
  
  const handleDeleteConfirm = () => {
    onDelete();
    setIsDeleteDialogOpen(false);
    toast.success('Event deleted successfully');
    onClose();
  };
  
  const getAccessLevelBadge = () => {
    switch(event.accessLevel) {
      case 'public':
        return <Badge variant="outline" className="bg-gray-100"><Globe className="h-3 w-3 mr-1" /> Public</Badge>;
      case 'residents':
        return <Badge variant="outline" className="bg-blue-100"><Users className="h-3 w-3 mr-1" /> Residents</Badge>;
      case 'committee':
        return <Badge variant="outline" className="bg-green-100"><Users className="h-3 w-3 mr-1" /> Committee</Badge>;
      case 'board':
        return <Badge variant="outline" className="bg-purple-100"><Users className="h-3 w-3 mr-1" /> Board Only</Badge>;
      case 'admin':
        return <Badge variant="outline" className="bg-red-100"><Users className="h-3 w-3 mr-1" /> Admin Only</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <>
      <Sheet open={!!event} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{event.title}</SheetTitle>
            <SheetDescription className="flex flex-wrap gap-2 mt-2">
              {getAccessLevelBadge()}
              <Badge variant="outline" className="capitalize bg-gray-100">
                <Tag className="h-3 w-3 mr-1" /> {event.type}
              </Badge>
              {event.isRecurring && (
                <Badge variant="outline" className="bg-amber-100">
                  <CalendarOff className="h-3 w-3 mr-1" /> Recurring
                </Badge>
              )}
            </SheetDescription>
          </SheetHeader>
          
          <div className="my-6 space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Date & Time</p>
                <p className="text-sm text-muted-foreground">{formatEventDateTime(event)}</p>
              </div>
            </div>
            
            {event.location && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </div>
            )}
            
            {event.attendees && event.attendees.length > 0 && (
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Attendees</p>
                  <p className="text-sm text-muted-foreground">
                    {event.attendees.length > 3 
                      ? `${event.attendees.slice(0, 3).join(', ')} and ${event.attendees.length - 3} more` 
                      : event.attendees.join(', ')}
                  </p>
                </div>
              </div>
            )}
            
            {event.description && (
              <div className="pt-4 mt-4 border-t">
                <p className="text-sm font-medium mb-2">Description</p>
                <p className="text-sm whitespace-pre-line">{event.description}</p>
              </div>
            )}
          </div>
          
          {canEditEvent() && (
            <SheetFooter className="flex-row gap-2 sm:justify-end">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Event
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventDetails;
