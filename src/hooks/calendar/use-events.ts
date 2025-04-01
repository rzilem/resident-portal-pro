
import { useState, useCallback } from 'react';
import { CalendarEvent, CalendarAccessLevel, CalendarEventType } from '@/types/calendar';
import { calendarService } from '@/services/calendar';
import { toast } from 'sonner';

interface UseEventsProps {
  userId: string;
  userAccessLevel: CalendarAccessLevel;
  associationId?: string;
}

export function useEvents({ userId, userAccessLevel, associationId }: UseEventsProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch all events
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const allEvents = await calendarService.getAllEvents(userId, userAccessLevel, associationId);
      setEvents(allEvents);
      setError(null);
    } catch (err) {
      console.error('Error fetching calendar events:', err);
      setError('Failed to load calendar events');
    } finally {
      setIsLoading(false);
    }
  }, [userId, userAccessLevel, associationId]);
  
  // Fetch events by date range
  const fetchEventsByDateRange = useCallback(async (start: Date, end: Date) => {
    setIsLoading(true);
    try {
      const rangeEvents = await calendarService.getEventsByDateRange(
        start, end, userId, userAccessLevel, associationId
      );
      setEvents(rangeEvents);
      setError(null);
    } catch (err) {
      console.error('Error fetching calendar events by date range:', err);
      setError('Failed to load calendar events for the selected date range');
    } finally {
      setIsLoading(false);
    }
  }, [userId, userAccessLevel, associationId]);
  
  // Fetch events by type
  const fetchEventsByType = useCallback(async (type: CalendarEventType) => {
    setIsLoading(true);
    try {
      const typeEvents = await calendarService.getEventsByType(
        type, userId, userAccessLevel, associationId
      );
      setEvents(typeEvents);
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${type} events:`, err);
      setError(`Failed to load ${type} events`);
    } finally {
      setIsLoading(false);
    }
  }, [userId, userAccessLevel, associationId]);
  
  // Get event by ID
  const getEventById = useCallback(async (id: string) => {
    try {
      const event = await calendarService.getEventById(id);
      return event;
    } catch (err) {
      console.error('Error fetching event by ID:', err);
      setError('Failed to load event details');
      return null;
    }
  }, []);
  
  // Create a new event
  const createEvent = useCallback(async (event: Omit<CalendarEvent, 'id'>) => {
    try {
      const newEvent = await calendarService.createEvent({
        ...event,
        createdBy: userId // Fixed property name
      });
      setEvents(prev => [...prev, newEvent]);
      toast.success('Event created successfully');
      return newEvent;
    } catch (err) {
      console.error('Error creating event:', err);
      toast.error('Failed to create event');
      throw err;
    }
  }, [userId]);
  
  // Update an existing event
  const updateEvent = useCallback(async (id: string, updates: Partial<CalendarEvent>) => {
    try {
      const updatedEvent = await calendarService.updateEvent(id, updates);
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event));
      
      if (selectedEvent?.id === id) {
        setSelectedEvent(updatedEvent);
      }
      
      toast.success('Event updated successfully');
      return updatedEvent;
    } catch (err) {
      console.error('Error updating event:', err);
      toast.error('Failed to update event');
      throw err;
    }
  }, [selectedEvent]);
  
  // Delete an event
  const deleteEvent = useCallback(async (id: string) => {
    try {
      await calendarService.deleteEvent(id);
      setEvents(prev => prev.filter(event => event.id !== id));
      
      if (selectedEvent?.id === id) {
        setSelectedEvent(null);
      }
      
      toast.success('Event deleted successfully');
    } catch (err) {
      console.error('Error deleting event:', err);
      toast.error('Failed to delete event');
      throw err;
    }
  }, [selectedEvent]);

  // Create a workflow event
  const createWorkflowEvent = useCallback(async (workflowId: string, title: string, start: Date) => {
    if (!associationId) {
      toast.error('Association ID is required to create a workflow event');
      return null;
    }
    
    try {
      const newEvent = await calendarService.createWorkflowEvent(workflowId, title, start, associationId);
      setEvents(prev => [...prev, newEvent]);
      toast.success('Workflow scheduled successfully');
      return newEvent;
    } catch (err) {
      console.error('Error scheduling workflow:', err);
      toast.error('Failed to schedule workflow');
      throw err;
    }
  }, [associationId]);
  
  return {
    events,
    selectedEvent,
    setSelectedEvent,
    isLoading,
    error,
    fetchEvents,
    fetchEventsByDateRange,
    fetchEventsByType,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    createWorkflowEvent
  };
}
