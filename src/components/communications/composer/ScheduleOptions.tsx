
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Clock } from 'lucide-react';
import { format, addDays, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useComposer } from './ComposerContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Time {
  value: string;
  label: string;
}

const ScheduleOptions: React.FC = () => {
  const times = generateTimes();
  const { 
    isScheduled, 
    setIsScheduled, 
    scheduledDate, 
    setScheduledDate, 
    scheduledTime, 
    setScheduledTime 
  } = useComposer();
  
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setScheduledDate(format(selectedDate, 'yyyy-MM-dd'));
    }
  };
  
  // Handle time selection
  const handleTimeSelect = (value: string) => {
    setScheduledTime(value);
  };
  
  // Handle toggle for scheduling
  const handleScheduleToggle = (checked: boolean) => {
    setIsScheduled(checked);
    
    // If turning on scheduling and no date is set, set a default date (tomorrow)
    if (checked && !date) {
      const tomorrow = addDays(new Date(), 1);
      setDate(tomorrow);
      setScheduledDate(format(tomorrow, 'yyyy-MM-dd'));
    }
  };
  
  // Format the selected date for display
  const formattedDate = date 
    ? isToday(date) 
      ? 'Today' 
      : format(date, 'PPP')
    : 'Select a date';

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch 
            id="schedule" 
            checked={isScheduled}
            onCheckedChange={handleScheduleToggle}
          />
          <Label htmlFor="schedule">Schedule for later</Label>
        </div>
      </div>
      
      {isScheduled && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="date-picker" className="mb-2 block">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-picker"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formattedDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                  disabled={[{ before: new Date() }]}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex-1">
            <Label htmlFor="time-select" className="mb-2 block">Time</Label>
            <Select value={scheduledTime} onValueChange={handleTimeSelect}>
              <SelectTrigger id="time-select" className="w-full">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {times.map((time) => (
                  <SelectItem key={time.value} value={time.value}>
                    {time.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      {isScheduled && (
        <div className="text-sm text-muted-foreground flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Your message will be sent on {formattedDate} at {
            times.find(t => t.value === scheduledTime)?.label || scheduledTime
          }
        </div>
      )}
    </div>
  );
};

// Generate time options in 30-minute intervals
function generateTimes(): Time[] {
  const times: Time[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const h = hour % 12 || 12; // Convert 0 to 12 for 12-hour format
      const period = hour < 12 ? 'AM' : 'PM';
      const value = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const label = `${h}:${minute.toString().padStart(2, '0')} ${period}`;
      times.push({ value, label });
    }
  }
  return times;
}

export default ScheduleOptions;
