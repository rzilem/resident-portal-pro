
import { useState, useEffect } from 'react';
import { CalendarAccessLevel, CalendarEvent } from '@/types/calendar';
import { useEvents } from './use-events';
import { useCalendarSettings } from './use-calendar-settings';

interface UseCalendarProps {
  userId: string;
  userAccessLevel: CalendarAccessLevel;
  associationId?: string;
}

export function useCalendar({ userId, userAccessLevel, associationId }: UseCalendarProps) {
  const {
    events,
    selectedEvent,
    setSelectedEvent,
    isLoading,
    error: eventsError,
    fetchEvents,
    fetchEventsByDateRange,
    fetchEventsByType,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    createWorkflowEvent
  } = useEvents({ userId, userAccessLevel, associationId });
  
  const {
    calendarSettings,
    error: settingsError,
    fetchCalendarSettings,
    updateCalendarSettings
  } = useCalendarSettings({ associationId });
  
  // Combine errors if any
  const error = eventsError || settingsError;
  
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
