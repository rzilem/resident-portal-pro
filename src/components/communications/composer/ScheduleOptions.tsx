
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface ScheduleOptionsProps {
  isScheduled: boolean;
  scheduledDate: string;
  onScheduledChange: (isScheduled: boolean) => void;
  onDateChange: (date: string) => void;
}

const ScheduleOptions: React.FC<ScheduleOptionsProps> = ({
  isScheduled,
  scheduledDate,
  onScheduledChange,
  onDateChange
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="scheduled"
          checked={isScheduled}
          onCheckedChange={(checked) => onScheduledChange(checked === true)}
        />
        <Label htmlFor="scheduled">Schedule message for later</Label>
      </div>
      
      {isScheduled && (
        <div className="pl-6">
          <Label htmlFor="scheduledDate">Date and time</Label>
          <Input
            id="scheduledDate"
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="mt-1"
          />
        </div>
      )}
    </div>
  );
};

export default ScheduleOptions;
