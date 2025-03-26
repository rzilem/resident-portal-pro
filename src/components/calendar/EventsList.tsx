
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, MapPin, Users, Tag } from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { calendarStyles } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface EventsListProps {
  selectedDate: Date;
  events: CalendarEvent[];
  isLoading: boolean;
  onSelectEvent: (event: CalendarEvent) => void;
}

const EventsList: React.FC<EventsListProps> = ({
  selectedDate,
  events,
  isLoading,
  onSelectEvent
}) => {
  const formatEventTime = (event: CalendarEvent) => {
    const start = typeof event.start === 'string' ? parseISO(event.start) : event.start;
    
    if (event.allDay) {
      return 'All Day';
    }
    
    let timeString = format(start, 'h:mm a');
    
    if (event.end) {
      const end = typeof event.end === 'string' ? parseISO(event.end) : event.end;
      timeString += ` - ${format(end, 'h:mm a')}`;
    }
    
    return timeString;
  };
  
  const getEventTypeColor = (type: string): string => {
    return calendarStyles.eventColors[type as keyof typeof calendarStyles.eventColors] || calendarStyles.eventColors.default;
  };
  
  const sortedEvents = [...events].sort((a, b) => {
    const aStart = typeof a.start === 'string' ? parseISO(a.start) : a.start;
    const bStart = typeof b.start === 'string' ? parseISO(b.start) : b.start;
    return aStart.getTime() - bStart.getTime();
  });
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          Events for {format(selectedDate, 'MMMM d, yyyy')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : sortedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
            <Calendar className="h-12 w-12 text-muted-foreground opacity-20 mb-2" />
            <p className="text-muted-foreground">No events scheduled for this date</p>
            <p className="text-xs text-muted-foreground mt-1">Double-click on the calendar to add an event</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedEvents.map((event) => (
              <div 
                key={event.id}
                className="p-3 border rounded-md hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => onSelectEvent(event)}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("w-1 self-stretch rounded-full", getEventTypeColor(event.type))} />
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium">{event.title}</h4>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{formatEventTime(event)}</span>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      
                      {event.attendees && event.attendees.length > 0 && (
                        <div className="flex items-center text-muted-foreground">
                          <Users className="h-3.5 w-3.5 mr-1" />
                          <span>{event.attendees.length} attendee{event.attendees.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-muted-foreground">
                        <Tag className="h-3.5 w-3.5 mr-1" />
                        <span className="capitalize">{event.type}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventsList;
