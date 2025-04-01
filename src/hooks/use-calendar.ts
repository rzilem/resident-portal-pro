
import { useState, useEffect } from 'react';
import { CalendarEvent, CalendarAccessLevel } from '@/types/calendar';
import { calendarService } from '@/services/calendar';
import { toast } from 'sonner';

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

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      // Get all events for the current user and await the result
      const userEvents = await calendarService.getAllEvents(userId, userAccessLevel, associationId);
      setEvents(userEvents);
    } catch (error) {
      console.error("Error loading calendar events:", error);
      toast.error("Failed to load calendar events");
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new event
  const createEvent = async (event: Omit<CalendarEvent, 'id'>) => {
    try {
      const newEvent = await calendarService.createEvent(event);
      setEvents(prev => [...prev, newEvent]);
      toast.success("Event created successfully");
      return newEvent;
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
      throw error;
    }
  };

  // Update an existing event
  const updateEvent = async (id: string, updates: Partial<CalendarEvent>) => {
    try {
      const updatedEvent = await calendarService.updateEvent(id, updates);
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event));
      if (selectedEvent?.id === id) {
        setSelectedEvent(updatedEvent);
      }
      toast.success("Event updated successfully");
      return updatedEvent;
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
      throw error;
    }
  };

  // Delete an event
  const deleteEvent = async (id: string) => {
    try {
      await calendarService.deleteEvent(id);
      setEvents(prev => prev.filter(event => event.id !== id));
      if (selectedEvent?.id === id) {
        setSelectedEvent(null);
      }
      toast.success("Event deleted successfully");
      return { success: true };
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
      throw error;
    }
  };

  // Create a workflow event
  const createWorkflowEvent = async (workflowId: string, title: string, start: Date) => {
    if (!associationId) {
      toast.error("Association ID is required to create a workflow event");
      return null;
    }
    
    try {
      const newEvent = await calendarService.createWorkflowEvent(workflowId, title, start, associationId);
      setEvents(prev => [...prev, newEvent]);
      toast.success("Workflow scheduled successfully");
      return newEvent;
    } catch (error) {
      console.error("Error creating workflow event:", error);
      toast.error("Failed to schedule workflow");
      throw error;
    }
  };

  return {
    events,
    selectedEvent,
    setSelectedEvent,
    isLoading,
    loadEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    createWorkflowEvent
  };
}
