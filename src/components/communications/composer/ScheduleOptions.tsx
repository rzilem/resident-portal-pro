
import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useComposer } from './ComposerContext';

const ScheduleOptions: React.FC = () => {
  const { 
    scheduledSend, 
    setScheduledSend, 
    scheduledDate, 
    setScheduledDate,
    scheduledTime,
    setScheduledTime,
    setIsScheduled
  } = useComposer();

  useEffect(() => {
    // Update the global scheduled state
    setIsScheduled(scheduledSend);
  }, [scheduledSend, setIsScheduled]);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setScheduledDate(date);
    }
  };

  // Create time options from 7 AM to 8 PM
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 7; hour <= 20; hour++) {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour;
      
      options.push(`${displayHour.toString().padStart(2, '0')}:00 ${period}`);
      options.push(`${displayHour.toString().padStart(2, '0')}:30 ${period}`);
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // Get the next half hour for default time
  const getDefaultTime = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    let defaultHour = hour;
    let defaultMinute = minute < 30 ? 30 : 0;
    
    if (minute >= 30) {
      defaultHour = (hour + 1) % 24;
    }
    
    const period = defaultHour >= 12 ? 'PM' : 'AM';
    const displayHour = defaultHour > 12 ? defaultHour - 12 : defaultHour === 0 ? 12 : defaultHour;
    
    return `${displayHour.toString().padStart(2, '0')}:${defaultMinute.toString().padStart(2, '0')} ${period}`;
  };

  // Set default time when schedule is enabled
  useEffect(() => {
    if (scheduledSend && !scheduledTime) {
      setScheduledTime(getDefaultTime());
    }
    
    if (scheduledSend && !scheduledDate) {
      setScheduledDate(new Date());
    }
  }, [scheduledSend, scheduledTime, scheduledDate, setScheduledTime, setScheduledDate]);

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center space-x-2">
        <Switch 
          id="schedule" 
          checked={scheduledSend} 
          onCheckedChange={setScheduledSend} 
        />
        <Label htmlFor="schedule">Schedule for later</Label>
      </div>
      
      {scheduledSend && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-full justify-start text-left font-normal mt-1"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduledDate ? format(scheduledDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={handleDateChange}
                  initialFocus
                  disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label htmlFor="time">Time</Label>
            <Select
              value={scheduledTime}
              onValueChange={setScheduledTime}
            >
              <SelectTrigger id="time" className="mt-1">
                <SelectValue placeholder="Select Time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleOptions;
