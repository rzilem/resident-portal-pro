
import React from 'react';
import { Card } from '@/components/ui/card';
import { CalendarAccessLevel } from '@/types/calendar';
import { Association } from '@/types/association';
import CalendarEventDialog from './CalendarEventDialog';
import CalendarFilters from './CalendarFilters';
import EventDetails from './EventDetails';
import CalendarHeader from './CalendarHeader';
import EventsList from './EventsList';
import CalendarDisplay from './CalendarDisplay';
import { useCalendarView } from '@/hooks/use-calendar-view';

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
  const {
    currentDate,
    selectedDate,
    setSelectedDate,
    view,
    showFilters,
    showEventDialog,
    setShowEventDialog,
    events,
    selectedDateEvents,
    selectedEvent,
    setSelectedEvent,
    isLoading,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventTypeForDay,
    handlePrevious,
    handleNext,
    handleToday,
    handleViewChange,
    toggleFilters
  } = useCalendarView({
    userId,
    userAccessLevel,
    associationId
  });
  
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
        onToggleFilters={toggleFilters}
        onCreateEvent={() => setShowEventDialog(true)}
      />
      
      {showFilters && <CalendarFilters />}
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <div className="md:col-span-5">
          <CalendarDisplay
            currentDate={currentDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            events={events}
            getEventTypeForDay={getEventTypeForDay}
          />
        </div>
        
        <div className="md:col-span-2">
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
