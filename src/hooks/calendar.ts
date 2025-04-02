
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { CalendarEvent } from '@/types/calendar';
import { calendarService } from '@/services/calendar';

interface UseCalendarProps {
  userId: string;
  userAccessLevel: 'public' | 'residents' | 'committee' | 'board' | 'admin';
  associationId?: string;
}

export function useCalendar({ userId, userAccessLevel, associationId }: UseCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log(`Fetching calendar events for ${associationId ? `association ${associationId}` : 'global view'}`);
      
      // Use await to ensure we get the events before updating state
      const allEvents = await calendarService.getAllEvents(userId, userAccessLevel, associationId);
      console.log(`Fetched ${allEvents.length} events`);
      setEvents(allEvents);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      toast.error('Failed to load calendar events');
    } finally {
      setIsLoading(false);
    }
  }, [associationId, userId, userAccessLevel]);
  
  // Fetch events on mount and when dependencies change
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);
  
  const fetchEventsByDateRange = useCallback(async (start: Date, end: Date) => {
    try {
      setIsLoading(true);
      console.log(`Fetching events by date range for ${associationId ? `association ${associationId}` : 'global view'}`);
      
      // Use await to ensure we get the events before updating state
      const rangeEvents = await calendarService.getEventsByDateRange(
        start, end, userId, userAccessLevel, associationId
      );
      console.log(`Fetched ${rangeEvents.length} events for date range`);
      setEvents(rangeEvents);
    } catch (error) {
      console.error('Error fetching events by date range:', error);
      toast.error('Failed to load events for the selected date range');
    } finally {
      setIsLoading(false);
    }
  }, [associationId, userId, userAccessLevel]);
  
  const createEvent = useCallback(async (event: Omit<CalendarEvent, 'id'>) => {
    try {
      console.log('Creating event:', event);
      
      // Ensure createdBy is set to the current user
      const eventData = {
        ...event,
        createdBy: userId
      };
      
      // Use await to ensure we get the new event before updating state
      const newEvent = await calendarService.createEvent(eventData);
      
      console.log('Event created successfully:', newEvent);
      // Update the events list with the new event
      setEvents(prev => [...prev, newEvent]);
      toast.success('Event created successfully');
      return newEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
      throw error;
    }
  }, [userId]);
  
  const updateEvent = useCallback(async (id: string, updates: Partial<CalendarEvent>) => {
    try {
      console.log('Updating event:', id, updates);
      
      // Use await to ensure we get the updated event before updating state
      const updatedEvent = await calendarService.updateEvent(id, updates);
      
      console.log('Event updated successfully:', updatedEvent);
      // Update the events list with the updated event
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event));
      // Update selectedEvent if it's the one being updated
      if (selectedEvent?.id === id) {
        setSelectedEvent(updatedEvent);
      }
      toast.success('Event updated successfully');
      return updatedEvent;
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
      throw error;
    }
  }, [selectedEvent]);
  
  const deleteEvent = useCallback(async (id: string) => {
    try {
      console.log('Deleting event:', id);
      
      // Use await to ensure deletion is complete before updating state
      await calendarService.deleteEvent(id);
      
      console.log('Event deleted successfully');
      // Remove the deleted event from the events list
      setEvents(prev => prev.filter(event => event.id !== id));
      // Clear selectedEvent if it's the one being deleted
      if (selectedEvent?.id === id) {
        setSelectedEvent(null);
      }
      toast.success('Event deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
      return false;
    }
  }, [selectedEvent]);
  
  const createWorkflowEvent = useCallback(async (
    workflowId: string,
    title: string,
    scheduledDateTime: Date
  ) => {
    if (!associationId) {
      toast.error('Association ID is required to create a workflow event');
      return null;
    }
    
    try {
      console.log('Creating workflow event:', workflowId, title, scheduledDateTime);
      
      // Use await to ensure we get the new event before updating state
      const newEvent = await calendarService.createWorkflowEvent(
        workflowId,
        title,
        scheduledDateTime,
        associationId
      );
      
      console.log('Workflow event created successfully:', newEvent);
      // Update the events list with the new event
      setEvents(prev => [...prev, newEvent]);
      toast.success('Workflow scheduled successfully');
      return newEvent;
    } catch (error) {
      console.error('Error creating workflow event:', error);
      toast.error('Failed to schedule workflow');
      throw error;
    }
  }, [associationId]);
  
  return {
    events,
    isLoading,
    selectedEvent,
    setSelectedEvent,
    fetchEvents,
    fetchEventsByDateRange,
    createEvent,
    updateEvent,
    deleteEvent,
    createWorkflowEvent
  };
}
