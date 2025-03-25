
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useComposer } from './ComposerContext';

const ScheduleOptions: React.FC = () => {
  const { 
    isScheduled, 
    setIsScheduled, 
    scheduledDate, 
    setScheduledDate 
  } = useComposer();

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="scheduled"
          checked={isScheduled}
          onCheckedChange={(checked) => setIsScheduled(checked === true)}
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
            onChange={(e) => setScheduledDate(e.target.value)}
            className="mt-1"
          />
        </div>
      )}
    </div>
  );
};

export default ScheduleOptions;
