
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useComposerContext } from './ComposerContext';

const ScheduleOptions: React.FC = () => {
  const { 
    scheduledSend, 
    setScheduledSend, 
    scheduledDate, 
    setScheduledDate,
    scheduledTime,
    setScheduledTime
  } = useComposerContext();

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setScheduledDate(date);
    }
  };

  const timeOptions = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM'
  ];

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
