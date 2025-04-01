
import React from 'react';
import { ScheduledProcess } from '@/types/process';
import { Button } from '@/components/ui/button';
import { Edit, Play, Pause, Trash2, MoreHorizontal } from 'lucide-react';
import { processSchedulerService } from '@/services/processSchedulerService';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { TooltipButton } from '@/components/ui/tooltip-button';

interface ProcessListProps {
  processes: ScheduledProcess[];
  onEdit: (process: ScheduledProcess) => void;
  onRefresh: () => void;
}

const ProcessList: React.FC<ProcessListProps> = ({ processes, onEdit, onRefresh }) => {
  const getProcessTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      'email-notification': 'bg-blue-500',
      'data-sync': 'bg-green-500',
      'report-generation': 'bg-purple-500',
      'data-cleanup': 'bg-yellow-500',
      'invoice-processing': 'bg-indigo-500',
      'payment-processing': 'bg-pink-500',
      'custom': 'bg-gray-500'
    };

    return (
      <Badge className={`${colors[type] || 'bg-gray-500'}`}>
        {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </Badge>
    );
  };

  const handleToggleEnabled = async (id: string, currentlyEnabled: boolean) => {
    try {
      const success = await processSchedulerService.toggleProcessEnabled(id, !currentlyEnabled);
      if (success) {
        toast.success(`Process ${!currentlyEnabled ? 'enabled' : 'disabled'} successfully`);
        onRefresh();
      } else {
        toast.error(`Failed to ${!currentlyEnabled ? 'enable' : 'disable'} process`);
      }
    } catch (error) {
      console.error('Error toggling process status:', error);
      toast.error(`Failed to ${!currentlyEnabled ? 'enable' : 'disable'} process`);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this process? This action cannot be undone.')) {
      try {
        const success = await processSchedulerService.deleteProcess(id);
        if (success) {
          toast.success('Process deleted successfully');
          onRefresh();
        } else {
          toast.error('Failed to delete process');
        }
      } catch (error) {
        console.error('Error deleting process:', error);
        toast.error('Failed to delete process');
      }
    }
  };

  const formatDateTime = (date: string, time: string) => {
    try {
      const dateObj = new Date(`${date}T${time}`);
      return format(dateObj, 'MMM d, yyyy \'at\' h:mm a');
    } catch (e) {
      return `${date} ${time}`;
    }
  };

  const formatFrequency = (frequency: string) => {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1);
  };

  return (
    <div className="space-y-4">
      {processes.map((process) => (
        <div
          key={process.id}
          className="border rounded-lg p-4 hover:bg-muted/40 transition-colors"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-lg">{process.name}</h3>
                {getProcessTypeBadge(process.process_type)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{process.description}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm">
                <span>Frequency: {formatFrequency(process.frequency)}</span>
                <span>Runs at: {formatDateTime(process.start_date, process.run_time)}</span>
                {process.last_run && (
                  <span>Last Run: {format(new Date(process.last_run), 'MMM d, yyyy \'at\' h:mm a')}</span>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-3 sm:mt-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <TooltipButton variant="ghost" size="icon" tooltipText="More options">
                    <MoreHorizontal className="h-5 w-5" />
                  </TooltipButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(process)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleToggleEnabled(process.id, process.enabled)}>
                    {process.enabled ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Disable
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Enable
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive" 
                    onClick={() => handleDelete(process.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <TooltipButton variant="outline" size="sm" tooltipText="Edit process details" onClick={() => onEdit(process)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </TooltipButton>
              <TooltipButton
                variant={process.enabled ? "destructive" : "default"}
                size="sm"
                tooltipText={process.enabled ? "Disable process" : "Enable process"}
                onClick={() => handleToggleEnabled(process.id, process.enabled)}
              >
                {process.enabled ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Disable
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Enable
                  </>
                )}
              </TooltipButton>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProcessList;
