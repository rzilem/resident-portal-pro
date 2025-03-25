
import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent, CalendarAccessLevel, CalendarEventType, AssociationCalendarSettings } from '@/types/calendar';
import { calendarService } from '@/services/calendarService';
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
  const [error, setError] = useState<string | null>(null);
  const [calendarSettings, setCalendarSettings] = useState<AssociationCalendarSettings | null>(null);
  
  // Fetch all events
  const fetchEvents = useCallback(() => {
    setIsLoading(true);
    try {
      const allEvents = calendarService.getAllEvents(userId, userAccessLevel, associationId);
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
  const fetchEventsByDateRange = useCallback((start: Date, end: Date) => {
    setIsLoading(true);
    try {
      const rangeEvents = calendarService.getEventsByDateRange(
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
  const fetchEventsByType = useCallback((type: CalendarEventType) => {
    setIsLoading(true);
    try {
      const typeEvents = calendarService.getEventsByType(
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
  const getEventById = useCallback((id: string) => {
    try {
      const event = calendarService.getEventById(id);
      return event;
    } catch (err) {
      console.error('Error fetching event by ID:', err);
      setError('Failed to load event details');
      return null;
    }
  }, []);
  
  // Create a new event
  const createEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    try {
      const newEvent = calendarService.createEvent(event);
      setEvents(prev => [...prev, newEvent]);
      toast.success('Event created successfully');
      return newEvent;
    } catch (err) {
      console.error('Error creating event:', err);
      toast.error('Failed to create event');
      throw err;
    }
  }, []);
  
  // Update an existing event
  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    try {
      const updatedEvent = calendarService.updateEvent(id, updates);
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
  const deleteEvent = useCallback((id: string) => {
    try {
      calendarService.deleteEvent(id);
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
  
  // Fetch calendar settings
  const fetchCalendarSettings = useCallback(() => {
    if (!associationId) return;
    
    try {
      const settings = calendarService.getCalendarSettingsByAssociationId(associationId);
      setCalendarSettings(settings);
    } catch (err) {
      console.error('Error fetching calendar settings:', err);
      setError('Failed to load calendar settings');
    }
  }, [associationId]);
  
  // Update calendar settings
  const updateCalendarSettings = useCallback((updates: Partial<AssociationCalendarSettings>) => {
    if (!associationId || !calendarSettings) return;
    
    try {
      const updatedSettings = calendarService.updateCalendarSettings(associationId, updates);
      setCalendarSettings(updatedSettings);
      toast.success('Calendar settings updated successfully');
      return updatedSettings;
    } catch (err) {
      console.error('Error updating calendar settings:', err);
      toast.error('Failed to update calendar settings');
      throw err;
    }
  }, [associationId, calendarSettings]);
  
  // Create a workflow event
  const createWorkflowEvent = useCallback((workflowId: string, title: string, start: Date) => {
    if (!associationId) {
      toast.error('Association ID is required to create a workflow event');
      return null;
    }
    
    try {
      const newEvent = calendarService.createWorkflowEvent(workflowId, title, start, associationId);
      setEvents(prev => [...prev, newEvent]);
      toast.success('Workflow scheduled successfully');
      return newEvent;
    } catch (err) {
      console.error('Error scheduling workflow:', err);
      toast.error('Failed to schedule workflow');
      throw err;
    }
  }, [associationId]);
  
  // Load initial data
  useEffect(() => {
    fetchEvents();
    if (associationId) {
      fetchCalendarSettings();
    }
  }, [fetchEvents, fetchCalendarSettings, associationId]);
  
  return {
    events,
    selectedEvent,
    setSelectedEvent,
    isLoading,
    error,
    calendarSettings,
    fetchEvents,
    fetchEventsByDateRange,
    fetchEventsByType,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    updateCalendarSettings,
    createWorkflowEvent
  };
}
