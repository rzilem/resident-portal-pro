
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { CalendarEvent, CalendarEventType } from '@/types/calendar';

interface EventsListProps {
  selectedDate: Date;
  events: CalendarEvent[];
  isLoading: boolean;
  onSelectEvent: (event: CalendarEvent) => void;
}

// Event type color mapping
const eventTypeColors: Record<CalendarEventType, string> = {
  meeting: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  maintenance: 'bg-amber-100 text-amber-800 hover:bg-amber-200',
  holiday: 'bg-red-100 text-red-800 hover:bg-red-200',
  deadline: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  workflow: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
  community: 'bg-green-100 text-green-800 hover:bg-green-200',
  custom: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
};

// Badge variant mapping
const badgeVariants: Record<CalendarEventType, string> = {
  meeting: 'blue',
  maintenance: 'amber',
  holiday: 'destructive',
  deadline: 'purple',
  workflow: 'indigo',
  community: 'green',
  custom: 'default'
};

const EventsList = ({ selectedDate, events, isLoading, onSelectEvent }: EventsListProps) => {
  return (
    <Card className="h-full">
      <CardContent className="pt-6 h-full">
        <h3 className="text-lg font-medium mb-4">
          {format(selectedDate, 'MMMM d, yyyy')} - Events
        </h3>
        
        {isLoading ? (
          <div className="text-center py-4">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No events scheduled</div>
        ) : (
          <div className="space-y-3 overflow-auto max-h-[400px] pr-1">
            {events.map((event) => (
              <div 
                key={event.id} 
                className={`p-3 rounded-md border cursor-pointer transition-colors ${eventTypeColors[event.type]}`}
                onClick={() => onSelectEvent(event)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{event.title}</h4>
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
                      <p className="text-sm text-muted-foreground truncate">{event.location}</p>
                    )}
                  </div>
                  <Badge variant={event.type === 'holiday' ? 'destructive' : 'default'} 
                         className={`${event.type !== 'holiday' ? 'bg-opacity-90' : ''}`}>
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
