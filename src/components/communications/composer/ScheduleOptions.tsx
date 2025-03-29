
import React, { useEffect } from 'react';
import { useComposer } from './ComposerContext';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

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

  // Set a default time when the user toggles scheduled send on
  useEffect(() => {
    if (scheduledSend && !scheduledTime) {
      // Default to current time rounded to next 30 minutes
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes() >= 30 ? 0 : 30;
      const nextHour = minutes === 0 ? hours + 1 : hours;
      
      const formattedHours = nextHour.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      
      setScheduledTime(`${formattedHours}:${formattedMinutes}`);
    }
  }, [scheduledSend, scheduledTime, setScheduledTime]);

  // Clear scheduled flag when toggling off
  useEffect(() => {
    if (!scheduledSend) {
      setIsScheduled(false);
    }
  }, [scheduledSend, setIsScheduled]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="schedule-send"
              checked={scheduledSend}
              onCheckedChange={setScheduledSend}
            />
            <Label htmlFor="schedule-send">Schedule for later</Label>
          </div>
        </div>

        {scheduledSend && (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="scheduled-date" className="mb-2 block">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                    id="scheduled-date"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? (
                      format(scheduledDate, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={scheduledDate || undefined}
                    onSelect={(date) => date && setScheduledDate(date)}
                    disabled={(date) => {
                      // Create a new Date object for today with time set to 00:00:00
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      
                      // Compare date objects correctly
                      return date < today;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex-1">
              <Label htmlFor="scheduled-time" className="mb-2 block">
                Time
              </Label>
              <Input
                id="scheduled-time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleOptions;
