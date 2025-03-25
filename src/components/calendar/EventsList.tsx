
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { CalendarEvent } from '@/types/calendar';

interface EventsListProps {
  selectedDate: Date;
  events: CalendarEvent[];
  isLoading: boolean;
  onSelectEvent: (event: CalendarEvent) => void;
}

const EventsList = ({ selectedDate, events, isLoading, onSelectEvent }: EventsListProps) => {
  return (
    <Card className="h-full">
      <CardContent className="pt-6 h-full">
        <h3 className="text-lg font-medium mb-4">
          {format(selectedDate, 'MMMM d, yyyy')}
        </h3>
        
        {isLoading ? (
          <div className="text-center py-4">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No events scheduled</div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="p-3 rounded-md border hover:bg-accent cursor-pointer"
                onClick={() => onSelectEvent(event)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    {!event.allDay && (
                      <p className="text-sm text-muted-foreground">
                        {typeof event.start === 'string'
                          ? format(parseISO(event.start), 'h:mm a')
                          : format(event.start, 'h:mm a')}
                        {event.end && ` - ${typeof event.end === 'string'
                          ? format(parseISO(event.end), 'h:mm a')
                          : format(event.end, 'h:mm a')}`}
                      </p>
                    )}
                    {event.location && (
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    )}
                  </div>
                  <Badge variant={event.type === 'holiday' ? 'destructive' : 'default'}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </Badge>
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
