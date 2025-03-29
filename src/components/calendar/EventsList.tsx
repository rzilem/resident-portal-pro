
import React from 'react';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { CalendarEvent } from '@/types/calendar';
import { Badge } from '@/components/ui/badge';

interface EventsListProps {
  selectedDate: Date;
  events: CalendarEvent[];
  isLoading: boolean;
  onSelectEvent: (event: CalendarEvent) => void;
  showAssociation?: boolean;
}

const EventsList: React.FC<EventsListProps> = ({
  selectedDate,
  events,
  isLoading,
  onSelectEvent,
  showAssociation = false
}) => {
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
  
  return (
    <Card className="p-4 h-full min-h-[500px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          Events for {format(selectedDate, 'MMMM d, yyyy')}
        </h3>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">No events for this day</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div 
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className="p-3 border rounded-md hover:bg-muted cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium">{event.title}</h4>
                <Badge className={typeColors[event.type] || 'bg-gray-100 text-gray-800'}>
                  {event.type}
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground mt-1">
                {event.allDay ? (
                  'All day'
                ) : (
                  <>
                    {format(new Date(event.start), 'h:mm a')}
                    {event.end && ` - ${format(new Date(event.end), 'h:mm a')}`}
                  </>
                )}
                {event.location && ` • ${event.location}`}
              </div>
              
              {showAssociation && event.associationId && (
                <div className="text-xs text-muted-foreground mt-1">
                  Association: {event.associationId}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default EventsList;
