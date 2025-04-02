
import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent, calendarService } from '@/services/calendarService';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { toast } from 'sonner';

export const useCalendar = (associationId?: string) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchEvents = useCallback(async (start?: Date, end?: Date) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to view events');
      return;
    }

    setIsLoading(true);
    try {
      const calendarEvents = await calendarService.getEvents(start, end, associationId);
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  }, [associationId, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
    }
  }, [fetchEvents, isAuthenticated]);

  const createEvent = useCallback(async (eventData: CalendarEvent) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to create events');
      return null;
    }

    const newEvent = await calendarService.createEvent({
      ...eventData,
      association_id: associationId
    });
    
    if (newEvent) {
      setEvents(prev => [...prev, newEvent]);
      toast.success('Event created successfully');
    }
    
    return newEvent;
  }, [associationId, isAuthenticated]);

  const updateEvent = useCallback(async (eventId: string, updates: Partial<CalendarEvent>) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to update events');
      return false;
    }

    const success = await calendarService.updateEvent(eventId, updates);
    
    if (success) {
      setEvents(prev => 
        prev.map(event => 
          event.id === eventId ? { ...event, ...updates } : event
        )
      );
      toast.success('Event updated successfully');
    }
    
    return success;
  }, [isAuthenticated]);

  const deleteEvent = useCallback(async (eventId: string) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to delete events');
      return false;
    }

    const success = await calendarService.deleteEvent(eventId);
    
    if (success) {
      setEvents(prev => prev.filter(event => event.id !== eventId));
      toast.success('Event deleted successfully');
    }
    
    return success;
  }, [isAuthenticated]);

  return {
    events,
    isLoading,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
