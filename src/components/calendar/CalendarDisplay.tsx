
import React, { useRef } from 'react';
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
  // Store last click time and clicked date using refs
  const lastClickTimeRef = useRef<number>(0);
  const lastClickedDateRef = useRef<Date | null>(null);
  
  // Handle day click
  const handleDayClick = (day: Date) => {
    onSelectDate(day);
    
    // Detect double clicks
    const now = new Date().getTime();
    const isSameDay = lastClickedDateRef.current && 
      lastClickedDateRef.current.getDate() === day.getDate() &&
      lastClickedDateRef.current.getMonth() === day.getMonth() &&
      lastClickedDateRef.current.getFullYear() === day.getFullYear();
      
    if (isSameDay && now - lastClickTimeRef.current < 300 && onDayDoubleClick) {
      onDayDoubleClick(day);
    }
    
    lastClickTimeRef.current = now;
    lastClickedDateRef.current = day;
  };
  
  // Create a component to render day contents with event indicators
  const DayContent = (props: { date: Date }) => {
    const eventType = getEventTypeForDay(props.date);
    const hasEvents = !!eventType;
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative">
          {props.date.getDate()}
          {hasEvents && (
            <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary`} />
          )}
        </div>
      </div>
    );
  };
  
  return (
    <Card className="p-4">
      <UICalendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onSelectDate(date)}
        month={currentDate}
        className="w-full"
        onDayClick={handleDayClick}
        components={{
          Day: ({ date, ...props }) => (
            <div {...props}>
              <DayContent date={date} />
            </div>
          )
        }}
      />
    </Card>
  );
};

export default CalendarDisplay;
