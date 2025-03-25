
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCalendar } from '@/hooks/use-calendar';
import { Workflow } from '@/types/workflow';
import { toast } from 'sonner';

interface WorkflowSchedulerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflow: Workflow;
  associationId: string;
  onScheduled?: () => void;
}

const WorkflowScheduler = ({ 
  open, 
  onOpenChange, 
  workflow, 
  associationId, 
  onScheduled 
}: WorkflowSchedulerProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('09:00');
  const [recurring, setRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState({
    frequency: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    interval: 1,
    endDate: undefined as Date | undefined
  });
  
  const { createWorkflowEvent } = useCalendar({
    userId: 'current-user', // In a real app, this would be the current user's ID
    userAccessLevel: 'admin',
    associationId
  });
  
  const handleSchedule = () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    
    if (!createWorkflowEvent) {
      toast.error("Failed to schedule workflow: createWorkflowEvent function not available");
      return;
    }
    
    // Combine date and time
    const scheduledDateTime = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    scheduledDateTime.setHours(hours, minutes, 0, 0);
    
    try {
      createWorkflowEvent(workflow.id, workflow.name, scheduledDateTime);
      toast.success("Workflow scheduled successfully");
      onScheduled?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error scheduling workflow:", error);
      toast.error("Failed to schedule workflow");
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Workflow</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Workflow</Label>
            <div className="p-2 border rounded-md bg-secondary/20">
              <p className="font-medium">{workflow.name}</p>
              <p className="text-sm text-muted-foreground">{workflow.description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-2" />
                <Input 
                  id="time" 
                  type="time" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="recurring" 
                checked={recurring}
                onCheckedChange={(checked) => setRecurring(!!checked)}
              />
              <Label htmlFor="recurring">Make this a recurring schedule</Label>
            </div>
            
            {recurring && (
              <div className="space-y-4 pl-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select
                      value={recurrence.frequency}
                      onValueChange={(value) => setRecurrence(prev => ({ 
                        ...prev, 
                        frequency: value as 'daily' | 'weekly' | 'monthly' | 'yearly' 
                      }))}
                    >
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="interval">Repeat every</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="interval"
                        type="number"
                        min="1"
                        value={recurrence.interval}
                        onChange={(e) => setRecurrence(prev => ({ 
                          ...prev, 
                          interval: parseInt(e.target.value) || 1 
                        }))}
                      />
                      <span>
                        {recurrence.frequency === 'daily' ? 'day(s)' : 
                         recurrence.frequency === 'weekly' ? 'week(s)' : 
                         recurrence.frequency === 'monthly' ? 'month(s)' : 'year(s)'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {recurrence.endDate 
                          ? format(recurrence.endDate, 'PPP') 
                          : <span>No end date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={recurrence.endDate}
                        onSelect={(date) => setRecurrence(prev => ({ ...prev, endDate: date }))}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSchedule}>
            Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowScheduler;
