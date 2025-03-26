
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarEvent } from '@/types/calendar';
import { format } from 'date-fns';
import { CalendarClock, MapPin, Users, Building } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface EventsListProps {
  selectedDate: Date;
  events: CalendarEvent[];
  isLoading: boolean;
  onSelectEvent: (event: CalendarEvent) => void;
  showAssociation?: boolean;
}

const EventsList = ({ 
  selectedDate, 
  events, 
  isLoading, 
  onSelectEvent,
  showAssociation = false
}: EventsListProps) => {
  const formattedDate = format(selectedDate, 'MMMM d, yyyy');
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="p-3 rounded-md border">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Events for {formattedDate}</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CalendarClock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No events scheduled for this day</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => {
              const start = typeof event.start === 'string' ? new Date(event.start) : event.start;
              const end = event.end 
                ? (typeof event.end === 'string' ? new Date(event.end) : event.end) 
                : null;
              
              const timeDisplay = event.allDay 
                ? 'All day' 
                : `${format(start, 'h:mm a')}${end ? ` - ${format(end, 'h:mm a')}` : ''}`;
              
              // Color map for event types
              const typeColors: Record<string, string> = {
                meeting: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
                maintenance: 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100',
                holiday: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
                deadline: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
                workflow: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100',
                community: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
                custom: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
              };
              
              return (
                <div 
                  key={event.id} 
                  className="p-3 rounded-md border hover:bg-accent/20 cursor-pointer"
                  onClick={() => onSelectEvent(event)}
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium">{event.title}</h4>
                    <Badge className={typeColors[event.type] || typeColors.custom}>
                      {event.type}
                    </Badge>
                  </div>
                  
                  <div className="mt-2 text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center">
                      <CalendarClock className="h-3.5 w-3.5 mr-1.5" />
                      {timeDisplay}
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1.5" />
                        {event.location}
                      </div>
                    )}
                    
                    {showAssociation && event.associationId && (
                      <div className="flex items-center">
                        <Building className="h-3.5 w-3.5 mr-1.5" />
                        {event.associationId.includes('assoc-') 
                          ? `Association ${event.associationId.replace('assoc-', '')}`
                          : event.associationId}
                      </div>
                    )}
                    
                    {event.accessLevel && (
                      <div className="flex items-center">
                        <Users className="h-3.5 w-3.5 mr-1.5" />
                        {event.accessLevel.charAt(0).toUpperCase() + event.accessLevel.slice(1)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventsList;
