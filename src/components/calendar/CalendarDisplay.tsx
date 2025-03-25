
import React from 'react';
import { Calendar, calendarStyles } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { format, isSameDay, parseISO } from 'date-fns';
import { CalendarEvent, CalendarEventType } from '@/types/calendar';

interface CalendarDisplayProps {
  currentDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date | undefined) => void;
  events: CalendarEvent[];
  getEventTypeForDay: (date: Date) => CalendarEventType | undefined;
}

const CalendarDisplay = ({
  currentDate,
  selectedDate,
  onSelectDate,
  events,
  getEventTypeForDay
}: CalendarDisplayProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
        </div>
        
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onSelectDate(date)}
          className="w-full border-none max-w-none"
          month={currentDate}
          showOutsideDays
          modifiers={{
            hasEvent: (date) => 
              events.some(event => {
                const eventStart = typeof event.start === 'string' ? parseISO(event.start) : event.start;
                return isSameDay(eventStart, date);
              })
          }}
          styles={{
            day: { width: '2.25rem', height: '2.25rem' }
          }}
          components={{
            DayContent: ({ date }) => {
              const hasEvents = events.some(event => {
                const eventStart = typeof event.start === 'string' ? parseISO(event.start) : event.start;
                return isSameDay(eventStart, date);
              });
              
              if (hasEvents) {
                const eventType = getEventTypeForDay(date);
                const eventClass = eventType ? calendarStyles.eventColors[eventType] : calendarStyles.eventColors.default;
                
                return (
                  <div className="relative flex h-full w-full items-center justify-center">
                    <div>{date.getDate()}</div>
                    <div className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${eventClass}`} />
                  </div>
                );
              }
              
              return <div>{date.getDate()}</div>;
            }
          }}
        />
      </CardContent>
    </Card>
  );
};

export default CalendarDisplay;
