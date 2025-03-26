
import { useState, useMemo } from 'react';
import { isSameDay, parseISO } from 'date-fns';
import { useCalendar } from '@/hooks/use-calendar';
import { CalendarEvent, CalendarAccessLevel, CalendarEventType } from '@/types/calendar';
import { calendarStyles } from '@/components/ui/calendar';
import { Association } from '@/types/association';

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
  
  const { 
    events, 
    selectedEvent, 
    setSelectedEvent, 
    isLoading, 
    createEvent, 
    updateEvent, 
    deleteEvent,
    createWorkflowEvent
  } = useCalendar({
    userId,
    userAccessLevel,
    associationId
  });
  
  const selectedDateEvents = useMemo(() => {
    return events.filter(event => {
      const eventStart = typeof event.start === 'string' ? parseISO(event.start) : event.start;
      return isSameDay(eventStart, selectedDate);
    });
  }, [events, selectedDate]);
  
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
    createEvent,
    updateEvent,
    deleteEvent,
    createWorkflowEvent,
    getEventTypeForDay,
    handlePrevious,
    handleNext,
    handleToday,
    handleViewChange,
    toggleFilters
  };
}
