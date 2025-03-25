
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Edit, 
  Trash2, 
  Share2,
  FileText,
  Repeat
} from 'lucide-react';
import { CalendarEvent, CalendarAccessLevel } from '@/types/calendar';
import { toast } from 'sonner';

interface EventDetailsProps {
  event: CalendarEvent;
  onClose: () => void;
  onEdit: (updateEvent: Partial<CalendarEvent>) => void;
  onDelete: () => void;
  userAccessLevel: CalendarAccessLevel;
}

const EventDetails = ({ 
  event, 
  onClose, 
  onEdit, 
  onDelete,
  userAccessLevel
}: EventDetailsProps) => {
  const canEdit = ['admin', 'board'].includes(userAccessLevel);
  
  const formatDateTime = (date: Date | string, allDay: boolean = false) => {
    if (allDay) {
      return typeof date === 'string'
        ? format(parseISO(date), 'MMMM d, yyyy')
        : format(date, 'MMMM d, yyyy');
    }
    
    return typeof date === 'string'
      ? format(parseISO(date), 'MMMM d, yyyy h:mm a')
      : format(date, 'MMMM d, yyyy h:mm a');
  };
  
  const handleShare = () => {
    // In a real implementation, this would open a share dialog
    // or copy the event details to the clipboard
    toast.success('Event details copied to clipboard');
  };
  
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center space-x-2">
            <Badge 
              variant={event.type === 'holiday' ? 'destructive' : 'default'}
              className="mr-2"
            >
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </Badge>
            {event.title}
          </DialogTitle>
          {event.associationId && (
            <DialogDescription>
              Association Event
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="space-y-4">
          {event.description && (
            <div>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {event.description}
              </p>
            </div>
          )}
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {event.allDay ? (
                formatDateTime(event.start, true)
              ) : (
                <>
                  {formatDateTime(event.start)}
                  {event.end && ` - ${formatDateTime(event.end)}`}
                </>
              )}
            </span>
          </div>
          
          {event.recurring && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Repeat className="h-4 w-4 mr-2" />
              <span>
                Repeats {event.recurring.frequency}, every {event.recurring.interval} {event.recurring.frequency === 'daily' ? 'day(s)' : event.recurring.frequency === 'weekly' ? 'week(s)' : event.recurring.frequency === 'monthly' ? 'month(s)' : 'year(s)'}
                {event.recurring.endDate && ` until ${typeof event.recurring.endDate === 'string' ? format(parseISO(event.recurring.endDate), 'MMMM d, yyyy') : format(event.recurring.endDate, 'MMMM d, yyyy')}`}
              </span>
            </div>
          )}
          
          {event.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{event.location}</span>
            </div>
          )}
          
          {event.workflowId && (
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="h-4 w-4 mr-2" />
              <span>Linked to workflow</span>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            
            {canEdit && (
              <>
                <Button variant="outline" size="sm" onClick={() => {/* would open edit dialog */}}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetails;
