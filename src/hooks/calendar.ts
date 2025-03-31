
import { useState, useCallback } from 'react';
import { workflowEventService } from '@/services/calendar/workflowEventService';
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
      const allEvents = workflowEventService.getScheduledWorkflows(associationId);
      setEvents(allEvents);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      toast.error('Failed to load calendar events');
    } finally {
      setIsLoading(false);
    }
  }, [associationId, userId, userAccessLevel]);
  
  const fetchEventsByDateRange = useCallback(async (start: Date, end: Date) => {
    try {
      setIsLoading(true);
      const events = calendarService.getEventsByDateRange(
        start, end, userId, userAccessLevel, associationId
      );
      setEvents(events);
    } catch (error) {
      console.error('Error fetching events by date range:', error);
      toast.error('Failed to load events for the selected date range');
    } finally {
      setIsLoading(false);
    }
  }, [associationId, userId, userAccessLevel]);
  
  const createWorkflowEvent = useCallback(async (
    workflowId: string,
    title: string,
    scheduledDateTime: Date
  ) => {
    try {
      const newEvent = await workflowEventService.createWorkflowEvent(
        workflowId,
        title,
        scheduledDateTime,
        associationId || 'default'
      );
      
      setEvents(prev => [...prev, newEvent]);
      toast.success('Workflow scheduled successfully');
      return newEvent;
    } catch (error) {
      console.error('Error creating workflow event:', error);
      toast.error('Failed to schedule workflow');
      throw error;
    }
  }, [associationId]);
  
  const cancelWorkflowEvent = useCallback(async (eventId: string) => {
    try {
      await workflowEventService.cancelScheduledWorkflow(eventId);
      setEvents(prev => prev.filter(event => event.id !== eventId));
      toast.success('Scheduled workflow canceled');
      return true;
    } catch (error) {
      console.error('Error canceling workflow event:', error);
      toast.error('Failed to cancel workflow');
      return false;
    }
  }, []);
  
  const executeWorkflowEvent = useCallback(async (eventId: string) => {
    try {
      const result = await workflowEventService.executeScheduledWorkflow(eventId);
      if (result) {
        fetchEvents();
      }
      return result;
    } catch (error) {
      console.error('Error executing workflow event:', error);
      toast.error('Failed to execute workflow');
      return false;
    }
  }, [fetchEvents]);
  
  // Add missing functions from calendarService
  const createEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    try {
      const newEvent = calendarService.createEvent(event);
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
      throw error;
    }
  }, []);
  
  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    try {
      const updatedEvent = calendarService.updateEvent(id, updates);
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event));
      if (selectedEvent?.id === id) {
        setSelectedEvent(updatedEvent);
      }
      return updatedEvent;
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
      throw error;
    }
  }, [selectedEvent]);
  
  const deleteEvent = useCallback((id: string) => {
    try {
      calendarService.deleteEvent(id);
      setEvents(prev => prev.filter(event => event.id !== id));
      if (selectedEvent?.id === id) {
        setSelectedEvent(null);
      }
      return { success: true };
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
      throw error;
    }
  }, [selectedEvent]);
  
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
    createWorkflowEvent,
    cancelWorkflowEvent,
    executeWorkflowEvent
  };
}
