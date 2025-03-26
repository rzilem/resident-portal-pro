
import { useState, useEffect } from 'react';
import { CalendarEvent, CalendarAccessLevel } from '@/types/calendar';
import { calendarService } from '@/services/calendar';

interface UseCalendarProps {
  userId: string;
  userAccessLevel: CalendarAccessLevel;
  associationId?: string;
}

export function useCalendar({ userId, userAccessLevel, associationId }: UseCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load events on component mount or when deps change
  useEffect(() => {
    loadEvents();
  }, [userId, userAccessLevel, associationId]);

  const loadEvents = () => {
    setIsLoading(true);
    try {
      // Get all events for the current user
      const userEvents = calendarService.getAllEvents(userId, userAccessLevel, associationId);
      setEvents(userEvents);
    } catch (error) {
      console.error("Error loading calendar events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new event
  const createEvent = (event: Omit<CalendarEvent, 'id'>) => {
    try {
      const newEvent = calendarService.createEvent(event);
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  };

  // Update an existing event
  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    try {
      const updatedEvent = calendarService.updateEvent(id, updates);
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event));
      if (selectedEvent?.id === id) {
        setSelectedEvent(updatedEvent);
      }
      return updatedEvent;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  };

  // Delete an event
  const deleteEvent = (id: string) => {
    try {
      calendarService.deleteEvent(id);
      setEvents(prev => prev.filter(event => event.id !== id));
      if (selectedEvent?.id === id) {
        setSelectedEvent(null);
      }
      return { success: true };
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  };

  // Create a workflow event
  const createWorkflowEvent = async (workflowId: string, title: string, start: Date) => {
    if (!associationId) {
      console.error("Association ID is required to create a workflow event");
      return null;
    }
    
    try {
      const newEvent = await calendarService.createWorkflowEvent(workflowId, title, start, associationId);
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (error) {
      console.error("Error creating workflow event:", error);
      throw error;
    }
  };

  return {
    events,
    selectedEvent,
    setSelectedEvent,
    isLoading,
    createEvent,
    updateEvent,
    deleteEvent,
    createWorkflowEvent
  };
}
