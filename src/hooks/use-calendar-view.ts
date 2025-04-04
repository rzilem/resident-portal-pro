
import { useState, useMemo, useEffect, useCallback } from 'react';
import { isSameDay, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { useCalendar } from '@/hooks/calendar';
import { CalendarEvent, CalendarEventType, CalendarAccessLevel } from '@/types/calendar';

interface UseCalendarViewProps {
  userId: string;
  userAccessLevel: CalendarAccessLevel;
  associationId?: string;
}

export function useCalendarView({ userId, userAccessLevel, associationId }: UseCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [showFilters, setShowFilters] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [activeEventType, setActiveEventType] = useState<CalendarEventType | 'all'>('all');
  
  const { 
    events, 
    selectedEvent, 
    setSelectedEvent, 
    isLoading, 
    createEvent, 
    updateEvent, 
    deleteEvent,
    createWorkflowEvent,
    fetchEvents,
    fetchEventsByDateRange
  } = useCalendar({
    userId,
    userAccessLevel,
    associationId
  });

  // Function to force refresh events
  const refreshEvents = useCallback(() => {
    if (view === 'month') {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      console.log(`Refreshing events for month range: ${start.toISOString()} to ${end.toISOString()}`);
      fetchEventsByDateRange(start, end);
    } else {
      console.log('Refreshing all events');
      fetchEvents();
    }
  }, [currentDate, view, fetchEvents, fetchEventsByDateRange]);

  useEffect(() => {
    if (view === 'month') {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      fetchEventsByDateRange(start, end);
    } else {
      fetchEvents();
    }
  }, [currentDate, view, associationId, fetchEvents, fetchEventsByDateRange]);
  
  useEffect(() => {
    fetchEvents();
  }, [associationId, fetchEvents]);
  
  const selectedDateEvents = useMemo(() => {
    if (activeEventType === 'all') {
      return events.filter(event => {
        const eventStart = typeof event.start === 'string' ? parseISO(event.start) : event.start;
        return isSameDay(eventStart, selectedDate);
      });
    } else {
      return events.filter(event => {
        const eventStart = typeof event.start === 'string' ? parseISO(event.start) : event.start;
        return isSameDay(eventStart, selectedDate) && event.type === activeEventType;
      });
    }
  }, [events, selectedDate, activeEventType]);
  
  const getEventTypeForDay = (date: Date): CalendarEventType | undefined => {
    const dayEvents = events.filter(event => {
      const eventStart = typeof event.start === 'string' ? parseISO(event.start) : event.start;
      return isSameDay(eventStart, date);
    });
    
    if (dayEvents.length === 0) return undefined;
    
    const typeCounts = dayEvents.reduce((counts, event) => {
      counts[event.type] = (counts[event.type] || 0) + 1;
      return counts;
    }, {} as Record<CalendarEventType, number>);
    
    let maxCount = 0;
    let predominantType: CalendarEventType | undefined;
    
    Object.entries(typeCounts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        predominantType = type as CalendarEventType;
      }
    });
    
    return predominantType;
  };

  const getEventsCountForDay = (date: Date): number => {
    return events.filter(event => {
      const eventStart = typeof event.start === 'string' ? parseISO(event.start) : event.start;
      return isSameDay(eventStart, date);
    }).length;
  };
  
  const handlePrevious = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (view === 'month') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else if (view === 'week') {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() - 1);
      }
      return newDate;
    });
  };
  
  const handleNext = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (view === 'month') {
        newDate.setMonth(newDate.getMonth() + 1);
      } else if (view === 'week') {
        newDate.setDate(newDate.getDate() + 7);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
      return newDate;
    });
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };
  
  const handleViewChange = (newView: 'month' | 'week' | 'day') => {
    setView(newView);
  };
  
  const toggleFilters = () => setShowFilters(!showFilters);

  const setEventTypeFilter = (type: CalendarEventType | 'all') => {
    setActiveEventType(type);
  };
  
  // Wrap calendar event operations to ensure we refresh after operations
  const wrappedCreateEvent = async (event: Omit<CalendarEvent, 'id'>) => {
    const result = await createEvent(event);
    refreshEvents();
    return result;
  };
  
  const wrappedUpdateEvent = async (id: string, updates: Partial<CalendarEvent>) => {
    const result = await updateEvent(id, updates);
    refreshEvents();
    return result;
  };
  
  const wrappedDeleteEvent = async (id: string) => {
    const result = await deleteEvent(id);
    refreshEvents();
    return result;
  };
  
  const wrappedCreateWorkflowEvent = async (
    workflowId: string,
    title: string,
    scheduledDateTime: Date
  ) => {
    const result = await createWorkflowEvent(workflowId, title, scheduledDateTime);
    refreshEvents();
    return result;
  };
  
  return {
    currentDate,
    selectedDate,
    setSelectedDate,
    view,
    showFilters,
    showEventDialog,
    setShowEventDialog,
    events,
    selectedDateEvents,
    selectedEvent,
    setSelectedEvent,
    isLoading,
    createEvent: wrappedCreateEvent,
    updateEvent: wrappedUpdateEvent,
    deleteEvent: wrappedDeleteEvent,
    createWorkflowEvent: wrappedCreateWorkflowEvent,
    getEventTypeForDay,
    getEventsCountForDay,
    handlePrevious,
    handleNext,
    handleToday,
    handleViewChange,
    toggleFilters,
    activeEventType,
    setEventTypeFilter,
    refreshEvents
  };
}
