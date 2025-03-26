
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, calendarStyles } from '@/components/ui/calendar';
import { format, isSameDay, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { CalendarEvent, CalendarEventType } from '@/types/calendar';
import { cn } from '@/lib/utils';

interface CalendarDisplayProps {
  currentDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  events: CalendarEvent[];
  getEventTypeForDay?: (date: Date) => CalendarEventType | undefined;
  onDayDoubleClick?: (date: Date) => void;
}

const CalendarDisplay: React.FC<CalendarDisplayProps> = ({
  currentDate,
  selectedDate,
  onSelectDate,
  events,
  getEventTypeForDay,
  onDayDoubleClick
}) => {
  const [calendarEvents, setCalendarEvents] = useState<{[key: string]: CalendarEvent[]}>({});
  
  // Process events into a date-indexed object
  useEffect(() => {
    const eventsByDate: {[key: string]: CalendarEvent[]} = {};
    
    events.forEach(event => {
      const eventDate = typeof event.start === 'string' ? parseISO(event.start) : event.start;
      const dateKey = format(eventDate, 'yyyy-MM-dd');
      
      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = [];
      }
      
      eventsByDate[dateKey].push(event);
    });
    
    setCalendarEvents(eventsByDate);
  }, [events]);
  
  // Get events for a specific date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return calendarEvents[dateKey] || [];
  };
  
  // Custom day renderer to show event indicators
  const renderDay = (day: Date) => {
    const dateEvents = getEventsForDate(day);
    const hasEvents = dateEvents.length > 0;
    const eventType = getEventTypeForDay ? getEventTypeForDay(day) : undefined;
    const eventColorClass = eventType 
      ? calendarStyles.eventColors[eventType] 
      : calendarStyles.eventColors.default;
    
    return (
      <div 
        onClick={() => onSelectDate(day)} 
        onDoubleClick={() => onDayDoubleClick && onDayDoubleClick(day)}
        className={cn(
          "w-full h-full flex flex-col items-center justify-center relative",
          isSameDay(day, selectedDate) && "font-bold text-primary"
        )}
      >
        {day.getDate()}
        {hasEvents && (
          <div 
            className={cn(
              "absolute bottom-0 w-[60%] h-1 rounded-full", 
              eventColorClass
            )} 
          />
        )}
      </div>
    );
  };
  
  // Generate date range for the current month
  const monthDates = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onSelectDate(date)}
          month={currentDate}
          weekStartsOn={0}
          components={{
            Day: ({ date, ...props }) => (
              <button {...props} className="w-full h-full">
                {renderDay(date)}
              </button>
            )
          }}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  );
};

export default CalendarDisplay;
