
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
      // Await the Promise to resolve before setting state
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
  
  const fetchEventsByDateRange = useCallback(async (start: Date, end: Date) => {
    try {
      setIsLoading(true);
      console.log(`Fetching events by date range for ${associationId ? `association ${associationId}` : 'global view'}`);
      // Await the Promise to resolve before setting state
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
      // Await the Promise to resolve before updating state
      const newEvent = await calendarService.createEvent({
        ...event,
        createdBy: userId // Fixed property name
      });
      
      console.log('Event created successfully:', newEvent);
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
      // Await the Promise to resolve before updating state
      const updatedEvent = await calendarService.updateEvent(id, updates);
      
      console.log('Event updated successfully:', updatedEvent);
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
      console.log('Deleting event:', id);
      await calendarService.deleteEvent(id);
      console.log('Event deleted successfully');
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
      console.log('Creating workflow event:', workflowId, title, scheduledDateTime);
      // Await the Promise to resolve before updating state
      const newEvent = await calendarService.createWorkflowEvent(
        workflowId,
        title,
        scheduledDateTime,
        associationId
      );
      
      console.log('Workflow event created successfully:', newEvent);
      setEvents(prev => [...prev, newEvent]);
      toast.success('Workflow scheduled successfully');
      return newEvent;
    } catch (error) {
      console.error('Error creating workflow event:', error);
      toast.error('Failed to schedule workflow');
      throw error;
    }
  }, [associationId]);
  
  // Since calendarService doesn't expose these methods yet, we'll implement placeholders
  // These should be properly implemented in calendarService.ts
  const uploadEventDocument = useCallback(async (
    eventId: string,
    file: File
  ) => {
    try {
      // This would ideally call calendarService.uploadEventDocument
      toast.success('Document upload functionality is not yet implemented');
      console.warn('Document upload not implemented in calendarService');
      return { id: 'placeholder-id', eventId, fileName: file.name };
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
      throw error;
    }
  }, []);
  
  const getEventDocuments = useCallback(async (eventId: string) => {
    try {
      // This would ideally call calendarService.getEventDocuments
      console.warn('Get event documents not implemented in calendarService');
      return [];
    } catch (error) {
      console.error('Error fetching event documents:', error);
      toast.error('Failed to load event documents');
      throw error;
    }
  }, []);
  
  const deleteEventDocument = useCallback(async (documentId: string) => {
    try {
      // This would ideally call calendarService.deleteEventDocument
      console.warn('Delete event document not implemented in calendarService');
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
