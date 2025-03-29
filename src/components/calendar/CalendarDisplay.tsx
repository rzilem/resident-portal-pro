
import React from 'react';
import { Calendar as UICalendar } from '@/components/ui/calendar';
import { CalendarEvent } from '@/types/calendar';
import { Card } from '@/components/ui/card';

interface CalendarDisplayProps {
  currentDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  events: CalendarEvent[];
  getEventTypeForDay: (date: Date) => string | undefined;
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
  // Create a function to render day contents with event indicators
  const renderDayContents = (day: Date) => {
    const eventType = getEventTypeForDay(day);
    const hasEvents = !!eventType;
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative">
          {day.getDate()}
          {hasEvents && (
            <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary`} />
          )}
        </div>
      </div>
    );
  };
  
  // Handle day double click
  const handleDayClick = (day: Date) => {
    onSelectDate(day);
    
    // Store the last click time to detect double clicks
    const now = new Date().getTime();
    if (handleDayClick.lastClickTime && 
        now - handleDayClick.lastClickTime < 300 && 
        onDayDoubleClick) {
      onDayDoubleClick(day);
    }
    handleDayClick.lastClickTime = now;
  };
  
  // Add lastClickTime property to the function
  (handleDayClick as any).lastClickTime = 0;
  
  return (
    <Card className="p-4">
      <UICalendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onSelectDate(date)}
        month={currentDate}
        className="w-full"
        onDayClick={handleDayClick}
        renderDay={renderDayContents}
      />
    </Card>
  );
};

export default CalendarDisplay;
