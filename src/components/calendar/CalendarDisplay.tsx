
import React, { useRef } from 'react';
import { Calendar as UICalendar } from '@/components/ui/calendar';
import { CalendarEvent, CalendarEventType } from '@/types/calendar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface CalendarDisplayProps {
  currentDate: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  events: CalendarEvent[];
  getEventTypeForDay: (date: Date) => string | undefined;
  getEventsCountForDay: (date: Date) => number;
  onDayDoubleClick?: (date: Date) => void;
}

const CalendarDisplay: React.FC<CalendarDisplayProps> = ({
  currentDate,
  selectedDate,
  onSelectDate,
  events,
  getEventTypeForDay,
  getEventsCountForDay,
  onDayDoubleClick
}) => {
  // Store last click time and clicked date using refs
  const lastClickTimeRef = useRef<number>(0);
  const lastClickedDateRef = useRef<Date | null>(null);
  
  // Event type colors for badges
  const typeColors: Record<string, string> = {
    'meeting': 'bg-blue-500',
    'maintenance': 'bg-amber-500',
    'holiday': 'bg-red-500',
    'deadline': 'bg-purple-500',
    'workflow': 'bg-indigo-500',
    'community': 'bg-green-500',
    'custom': 'bg-gray-500'
  };
  
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
    const eventType = getEventTypeForDay(props.date) as string;
    const eventsCount = getEventsCountForDay(props.date);
    const hasEvents = eventsCount > 0;
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative flex flex-col items-center">
          <div className={`rounded-full ${hasEvents ? 'text-white font-medium' : ''} w-8 h-8 flex items-center justify-center ${
            hasEvents ? (typeColors[eventType] || 'bg-primary') : ''
          }`}>
            {props.date.getDate()}
          </div>
          {hasEvents && eventsCount > 0 && (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-xs mt-1">
                    <Badge variant="outline" className="h-4 min-w-4 px-1 text-[10px]">
                      {eventsCount}
                    </Badge>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="z-50">
                  <p>{eventsCount} event{eventsCount !== 1 ? 's' : ''} on {format(props.date, 'MMMM d')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <Card className="p-4">
      <div className="mb-4 text-center">
        <h2 className="text-xl font-medium">{format(currentDate, 'MMMM yyyy')}</h2>
      </div>
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
