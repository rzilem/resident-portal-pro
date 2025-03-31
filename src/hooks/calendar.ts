
import { useState, useCallback } from 'react';
import { workflowEventService } from '@/services/calendar/workflowEventService';
import { toast } from 'sonner';
import { CalendarEvent } from '@/types/calendar';

interface UseCalendarProps {
  userId: string;
  userAccessLevel: 'public' | 'residents' | 'committee' | 'board' | 'admin';
  associationId?: string;
}

export function useCalendar({ userId, userAccessLevel, associationId }: UseCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  return {
    events,
    isLoading,
    fetchEvents,
    createWorkflowEvent,
    cancelWorkflowEvent,
    executeWorkflowEvent
  };
}
