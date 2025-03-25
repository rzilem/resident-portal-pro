
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { format, isSameDay, parseISO } from 'date-fns';
import { CalendarEvent, CalendarAccessLevel } from '@/types/calendar';
import { useCalendar } from '@/hooks/use-calendar';
import CalendarEventDialog from './CalendarEventDialog';
import CalendarFilters from './CalendarFilters';
import EventDetails from './EventDetails';
import { Association } from '@/types/association';
import CalendarHeader from './CalendarHeader';
import EventsList from './EventsList';

interface CalendarViewProps {
  userId: string;
  userAccessLevel: CalendarAccessLevel;
  associationId?: string;
  isGlobalAdmin?: boolean;
  associations?: Association[];
  activeAssociation?: Association | null;
  onAssociationChange?: (association: Association) => void;
}

const CalendarView = ({ 
  userId, 
  userAccessLevel, 
  associationId,
  isGlobalAdmin = false,
  associations = [],
  activeAssociation,
  onAssociationChange
}: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [showFilters, setShowFilters] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  
  const { 
    events, 
    selectedEvent, 
    setSelectedEvent, 
    isLoading, 
    createEvent, 
    updateEvent, 
    deleteEvent 
  } = useCalendar({
    userId,
    userAccessLevel,
    associationId
  });
  
  const selectedDateEvents = events.filter(event => {
    const eventStart = typeof event.start === 'string' ? parseISO(event.start) : event.start;
    return isSameDay(eventStart, selectedDate);
  });
  
  const handlePrevious = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (view === 'month') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else if (view === 'week') {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() - 1);
      }
      return newDate;
    });
  };
  
  const handleNext = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (view === 'month') {
        newDate.setMonth(newDate.getMonth() + 1);
      } else if (view === 'week') {
        newDate.setDate(newDate.getDate() + 7);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
      return newDate;
    });
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };
  
  const handleViewChange = (newView: 'month' | 'week' | 'day') => {
    setView(newView);
  };
  
  const handleAssociationChange = (associationId: string) => {
    if (onAssociationChange && associations.length > 0) {
      const association = associations.find(a => a.id === associationId);
      if (association) {
        onAssociationChange(association);
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <CalendarHeader 
        view={view}
        currentDate={currentDate}
        isGlobalAdmin={isGlobalAdmin}
        associations={associations}
        activeAssociation={activeAssociation || null}
        onAssociationChange={handleAssociationChange}
        onViewChange={handleViewChange}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onCreateEvent={() => setShowEventDialog(true)}
      />
      
      {showFilters && <CalendarFilters />}
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold">
                  {format(currentDate, view === 'month' ? 'MMMM yyyy' : 'MMMM d, yyyy')}
                </h2>
              </div>
              
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="w-full border-none max-w-none"
                month={currentDate}
                showOutsideDays
                modifiers={{
                  hasEvent: (date) => 
                    events.some(event => {
                      const eventStart = typeof event.start === 'string' ? parseISO(event.start) : event.start;
                      return isSameDay(eventStart, date);
                    })
                }}
                modifiersClassNames={{
                  hasEvent: "relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-primary/10 before:rounded-full"
                }}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="h-full">
          <EventsList 
            selectedDate={selectedDate}
            events={selectedDateEvents}
            isLoading={isLoading}
            onSelectEvent={setSelectedEvent}
          />
        </div>
      </div>
      
      {selectedEvent && (
        <EventDetails 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)}
          onEdit={(updatedEvent) => updateEvent(selectedEvent.id, updatedEvent)}
          onDelete={() => deleteEvent(selectedEvent.id)}
          userAccessLevel={userAccessLevel}
        />
      )}
      
      {showEventDialog && (
        <CalendarEventDialog 
          open={showEventDialog}
          onOpenChange={setShowEventDialog}
          onSave={createEvent}
          associationId={associationId}
          userAccessLevel={userAccessLevel}
        />
      )}
    </div>
  );
};

export default CalendarView;
