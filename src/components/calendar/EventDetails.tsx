
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CalendarEvent, CalendarAccessLevel } from '@/types/calendar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Calendar as CalendarIcon, Users, Trash, Edit } from 'lucide-react';

interface EventDetailsProps {
  event: CalendarEvent;
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
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
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  // Format dates for display
  const formatDate = (date: string | Date) => {
    return format(new Date(date), 'PPP');
  };
  
  const formatTime = (date: string | Date) => {
    return format(new Date(date), 'h:mm a');
  };
  
  // Check if user has edit/delete permissions based on access level
  const canEditDelete = 
    userAccessLevel === 'admin' || 
    (userAccessLevel === 'board' && ['board', 'residents', 'public'].includes(event.accessLevel)) ||
    (userAccessLevel === 'committee' && ['committee', 'residents', 'public'].includes(event.accessLevel));
  
  // Event type colors for badges
  const typeColors: Record<string, string> = {
    'meeting': 'bg-blue-100 text-blue-800 border-blue-300',
    'maintenance': 'bg-amber-100 text-amber-800 border-amber-300',
    'holiday': 'bg-red-100 text-red-800 border-red-300',
    'deadline': 'bg-purple-100 text-purple-800 border-purple-300',
    'workflow': 'bg-indigo-100 text-indigo-800 border-indigo-300',
    'community': 'bg-green-100 text-green-800 border-green-300',
    'custom': 'bg-gray-100 text-gray-800 border-gray-300'
  };
  
  if (confirmDelete) {
    return (
      <Dialog open={true} onOpenChange={() => setConfirmDelete(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
          </DialogHeader>
          
          <div className="py-6">
            <p>Are you sure you want to delete "{event.title}"?</p>
            <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl mr-2">{event.title}</DialogTitle>
            <Badge className={typeColors[event.type] || 'bg-gray-100 text-gray-800'}>
              {event.type}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {event.description && (
            <div className="text-sm">
              {event.description}
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>
                {formatDate(event.start)}
                {event.end && event.end !== event.start && ` - ${formatDate(event.end)}`}
              </span>
            </div>
            
            {!event.allDay && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                <span>
                  {formatTime(event.start)}
                  {event.end && ` - ${formatTime(event.end)}`}
                </span>
              </div>
            )}
            
            {event.location && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{event.location}</span>
              </div>
            )}
            
            {event.accessLevel && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-2 h-4 w-4" />
                <span>Visible to: {event.accessLevel}</span>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          {canEditDelete && (
            <>
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => setConfirmDelete(true)}>
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => onEdit(event)}>
                <Edit className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetails;
