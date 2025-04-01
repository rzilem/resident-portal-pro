
import { useState, useCallback } from 'react';
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
      const allEvents = await calendarService.getAllEvents(userId, userAccessLevel, associationId);
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
      const events = await calendarService.getEventsByDateRange(
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
  
  const createEvent = useCallback(async (event: Omit<CalendarEvent, 'id'>) => {
    try {
      const newEvent = await calendarService.createEvent({
        ...event,
        created_by: userId
      });
      
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
      const updatedEvent = await calendarService.updateEvent(id, updates);
      setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event));
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
      await calendarService.deleteEvent(id);
      setEvents(prev => prev.filter(event => event.id !== id));
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
      const newEvent = await calendarService.createWorkflowEvent(
        workflowId,
        title,
        scheduledDateTime,
        associationId
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
  
  const uploadEventDocument = useCallback(async (
    eventId: string,
    file: File
  ) => {
    try {
      const document = await calendarService.uploadEventDocument(eventId, file);
      toast.success('Document uploaded successfully');
      return document;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
      throw error;
    }
  }, []);
  
  const getEventDocuments = useCallback(async (eventId: string) => {
    try {
      return await calendarService.getEventDocuments(eventId);
    } catch (error) {
      console.error('Error fetching event documents:', error);
      toast.error('Failed to load event documents');
      throw error;
    }
  }, []);
  
  const deleteEventDocument = useCallback(async (documentId: string) => {
    try {
      await calendarService.deleteEventDocument(documentId);
      toast.success('Document deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
      return false;
    }
  }, []);
  
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
    uploadEventDocument,
    getEventDocuments,
    deleteEventDocument
  };
}
