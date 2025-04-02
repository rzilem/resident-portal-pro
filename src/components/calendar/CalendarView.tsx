
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { CalendarAccessLevel } from '@/types/calendar';
import { Association } from '@/types/association';
import CalendarEventDialog from './CalendarEventDialog';
import QuickEventDialog from './QuickEventDialog';
import CalendarFilters from './CalendarFilters';
import EventDetails from './EventDetails';
import CalendarHeader from './CalendarHeader';
import EventsList from './EventsList';
import CalendarDisplay from './CalendarDisplay';
import { useCalendarView } from '@/hooks/use-calendar-view';
import { useToast } from '@/components/ui/use-toast';

interface CalendarViewProps {
  userId: string;
  userAccessLevel: CalendarAccessLevel;
  associationId?: string;
  isGlobalAdmin?: boolean;
  isManagerView?: boolean;
  associations?: Association[];
  activeAssociation?: Association | null;
  onAssociationChange?: (association: Association) => void;
  onManagerViewToggle?: () => void;
}

const CalendarView = ({ 
  userId, 
  userAccessLevel, 
  associationId,
  isGlobalAdmin = false,
  isManagerView = false,
  associations = [],
  activeAssociation,
  onAssociationChange,
  onManagerViewToggle
}: CalendarViewProps) => {
  // Get workflows for the association (would be implemented in a real app)
  const workflows = [];
  const { toast } = useToast();
  
  const [quickEventDate, setQuickEventDate] = useState<Date | null>(null);
  
  // Pass isGlobalAdmin to the useCalendarView hook to ensure we don't filter by associationId when in global view
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
    createWorkflowEvent,
    getEventTypeForDay,
    getEventsCountForDay,
    handlePrevious,
    handleNext,
    handleToday,
    handleViewChange,
    toggleFilters,
    activeEventType,
    setEventTypeFilter,
    // Add refresh function to force reload events
    refreshEvents
  } = useCalendarView({
    userId,
    userAccessLevel,
    associationId: isGlobalAdmin ? undefined : associationId // Don't filter by associationId for global view
  });
  
  // This will log events whenever they change to help with debugging
  useEffect(() => {
    console.log("Calendar events loaded:", events);
  }, [events]);
  
  const handleAssociationChange = (associationId: string) => {
    if (onAssociationChange && associations.length > 0) {
      const association = associations.find(a => a.id === associationId);
      if (association) {
        onAssociationChange(association);
      }
    }
  };
  
  const handleDayDoubleClick = (date: Date) => {
    setQuickEventDate(date);
  };

  const handleCreateEvent = async (eventData: any) => {
    try {
      // For global view, ensure associationId is set properly
      const eventWithAssociation = {
        ...eventData,
        associationId: eventData.associationId || associationId
      };
      
      console.log("Creating event with data:", eventWithAssociation);
      await createEvent(eventWithAssociation);
      
      // Force refresh events after creation
      refreshEvents();
      
      toast({
        title: "Event created",
        description: "Your event has been created successfully.",
      });
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error creating event",
        description: "There was a problem creating your event.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateEvent = async (id: string, updates: any) => {
    try {
      await updateEvent(id, updates);
      
      // Force refresh events after update
      refreshEvents();
      
      toast({
        title: "Event updated",
        description: "Your event has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error updating event",
        description: "There was a problem updating your event.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);
      
      // Force refresh events after deletion
      refreshEvents();
      
      toast({
        title: "Event deleted",
        description: "Your event has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error deleting event",
        description: "There was a problem deleting your event.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <CalendarHeader 
        view={view}
        currentDate={currentDate}
        isGlobalAdmin={isGlobalAdmin}
        showManagerToggle={!!onManagerViewToggle}
        isManagerView={isManagerView}
        onManagerViewToggle={onManagerViewToggle}
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
      
      {showFilters && (
        <CalendarFilters 
          activeFilter={activeEventType} 
          onFilterChange={setEventTypeFilter} 
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <div className="md:col-span-5">
          <CalendarDisplay
            currentDate={currentDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            events={events}
            getEventTypeForDay={getEventTypeForDay}
            getEventsCountForDay={getEventsCountForDay}
            onDayDoubleClick={handleDayDoubleClick}
          />
        </div>
        
        <div className="md:col-span-2">
          <EventsList 
            selectedDate={selectedDate}
            events={selectedDateEvents}
            isLoading={isLoading}
            onSelectEvent={setSelectedEvent}
            showAssociation={isManagerView || isGlobalAdmin}
          />
        </div>
      </div>
      
      {selectedEvent && (
        <EventDetails 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)}
          onEdit={(updatedEvent) => handleUpdateEvent(selectedEvent.id, updatedEvent)}
          onDelete={() => handleDeleteEvent(selectedEvent.id)}
          userAccessLevel={userAccessLevel}
        />
      )}
      
      {showEventDialog && (
        <CalendarEventDialog 
          open={showEventDialog}
          onOpenChange={setShowEventDialog}
          onSave={handleCreateEvent}
          associationId={associationId}
          userAccessLevel={userAccessLevel}
          isGlobalView={isGlobalAdmin}
          associations={isGlobalAdmin ? associations : undefined}
        />
      )}
      
      {quickEventDate && (
        <QuickEventDialog
          open={!!quickEventDate}
          onOpenChange={(open) => !open && setQuickEventDate(null)}
          date={quickEventDate}
          onSaveEvent={handleCreateEvent}
          onScheduleWorkflow={createWorkflowEvent}
          associationId={associationId}
          userAccessLevel={userAccessLevel}
          workflows={workflows}
          isGlobalView={isGlobalAdmin}
          associations={isGlobalAdmin ? associations : undefined}
        />
      )}
    </div>
  );
};

export default CalendarView;
