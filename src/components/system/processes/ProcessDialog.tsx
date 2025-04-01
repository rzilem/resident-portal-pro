
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { processSchedulerService } from '@/services/processSchedulerService';
import { ScheduledProcess, ProcessType, ProcessFrequency } from '@/types/process';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { toast } from 'sonner';

interface ProcessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void; // Changed from onClose to onOpenChange
  process: ScheduledProcess | null;
  onSave: () => Promise<void>; // Changed to match what ProcessScheduler is passing
}

interface FormValues {
  name: string;
  description: string;
  process_type: ProcessType;
  frequency: ProcessFrequency;
  start_date: string;
  run_time: string;
  enabled: boolean;
  parameters: Record<string, any>;
}

const ProcessDialog: React.FC<ProcessDialogProps> = ({ open, onOpenChange, process, onSave }) => {
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      name: process?.name || '',
      description: process?.description || '',
      process_type: process?.process_type || 'email-notification',
      frequency: process?.frequency || 'daily',
      start_date: process?.start_date || new Date().toISOString().split('T')[0],
      run_time: process?.run_time || '09:00:00',
      enabled: process?.enabled ?? true,
      parameters: process?.parameters || {}
    }
  });

  React.useEffect(() => {
    if (open) {
      reset({
        name: process?.name || '',
        description: process?.description || '',
        process_type: process?.process_type || 'email-notification',
        frequency: process?.frequency || 'daily',
        start_date: process?.start_date || new Date().toISOString().split('T')[0],
        run_time: process?.run_time || '09:00:00',
        enabled: process?.enabled ?? true,
        parameters: process?.parameters || {}
      });
    }
  }, [open, process, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      if (process?.id) {
        // Update existing process
        await processSchedulerService.updateProcess(process.id, data);
      } else {
        // Create new process
        await processSchedulerService.createProcess(data);
      }
      onSave();
      onOpenChange(false); // Use onOpenChange instead of onClose
    } catch (error) {
      console.error('Error saving process:', error);
      toast.error('Failed to save process');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{process ? 'Edit Process' : 'Schedule New Process'}</DialogTitle>
          <DialogDescription>
            {process 
              ? 'Update the settings for this scheduled process.' 
              : 'Configure a new automated process to run on a schedule.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Process Name</Label>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <Input id="name" placeholder="Daily Email Notifications" {...field} />
                )}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea 
                    id="description" 
                    placeholder="Describe what this process does" 
                    rows={2}
                    {...field} 
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="process_type">Process Type</Label>
                <Controller
                  name="process_type"
                  control={control}
                  rules={{ required: 'Process type is required' }}
                  render={({ field }) => (
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select process type" />
                      </SelectTrigger>
                      <SelectContent>
                        {processSchedulerService.getProcessTypes().map((type) => (
                          <SelectItem key={type.type} value={type.type}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Controller
                  name="frequency"
                  control={control}
                  rules={{ required: 'Frequency is required' }}
                  render={({ field }) => (
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {processSchedulerService.getFrequencyOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Controller
                  name="start_date"
                  control={control}
                  rules={{ required: 'Start date is required' }}
                  render={({ field }) => (
                    <Input id="start_date" type="date" {...field} />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="run_time">Run Time</Label>
                <Controller
                  name="run_time"
                  control={control}
                  rules={{ required: 'Run time is required' }}
                  render={({ field }) => (
                    <Input id="run_time" type="time" step="1" {...field} />
                  )}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Controller
                name="enabled"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                )}
              />
              <Label htmlFor="enabled" className="text-sm font-medium">
                Enable process immediately
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : process ? 'Update Process' : 'Schedule Process'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessDialog;
