
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Zap, User } from 'lucide-react';
import { TriggerStep, TRIGGER_TYPES } from './types';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TriggerStepContentProps {
  step: TriggerStep;
  updateStep: (id: string, data: Partial<TriggerStep>) => void;
  readOnly?: boolean;
}

const TriggerStepContent = ({ step, updateStep, readOnly = false }: TriggerStepContentProps) => {
  const [date, setDate] = React.useState<Date | undefined>(
    step.config.startDate ? new Date(step.config.startDate) : undefined
  );

  // Function to render the appropriate icon for the trigger type
  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case 'Calendar': return <CalendarIcon className="h-4 w-4" />;
      case 'Zap': return <Zap className="h-4 w-4" />;
      case 'User': return <User className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleTriggerTypeChange = (value: string) => {
    if (readOnly) return;
    
    const newConfig = { ...step.config };
    
    // Reset config based on new trigger type
    if (value === 'time') {
      newConfig.startDate = date ? date.toISOString() : new Date().toISOString();
      newConfig.recurrence = 'none';
    } else if (value === 'event') {
      newConfig.eventType = '';
    } else if (value === 'manual') {
      newConfig.roles = ['admin'];
    }
    
    updateStep(step.id, { 
      triggerType: value,
      config: newConfig
    });
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (readOnly || !newDate) return;
    
    setDate(newDate);
    
    updateStep(step.id, {
      config: {
        ...step.config,
        startDate: newDate.toISOString()
      }
    });
  };

  const handleRecurrenceChange = (value: string) => {
    if (readOnly) return;
    
    updateStep(step.id, {
      config: {
        ...step.config,
        recurrence: value
      }
    });
  };

  const handleEventTypeChange = (value: string) => {
    if (readOnly) return;
    
    updateStep(step.id, {
      config: {
        ...step.config,
        eventType: value
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Trigger Type</Label>
        <Select 
          value={step.triggerType}
          onValueChange={handleTriggerTypeChange}
          disabled={readOnly}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select trigger type" />
          </SelectTrigger>
          <SelectContent>
            {TRIGGER_TYPES.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                <div className="flex items-center">
                  {renderIcon(type.icon)}
                  <span className="ml-2">{type.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {step.triggerType === 'time' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                  disabled={readOnly}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>Recurrence</Label>
            <Select 
              value={step.config.recurrence || 'none'}
              onValueChange={handleRecurrenceChange}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">One-time</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      {step.triggerType === 'event' && (
        <div className="space-y-2">
          <Label>Event Type</Label>
          <Select 
            value={step.config.eventType || ''}
            onValueChange={handleEventTypeChange}
            disabled={readOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="payment.received">Payment Received</SelectItem>
              <SelectItem value="violation.reported">Violation Reported</SelectItem>
              <SelectItem value="maintenance.requested">Maintenance Requested</SelectItem>
              <SelectItem value="resident.onboarded">New Resident Onboarded</SelectItem>
              <SelectItem value="document.uploaded">Document Uploaded</SelectItem>
              <SelectItem value="meeting.scheduled">Meeting Scheduled</SelectItem>
              <SelectItem value="email.received">Email Received</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      {step.triggerType === 'manual' && (
        <div className="space-y-2">
          <Label>Who can trigger this workflow?</Label>
          <Select defaultValue={step.config.roles?.[0] || 'admin'} disabled={readOnly}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrators Only</SelectItem>
              <SelectItem value="board">Board Members</SelectItem>
              <SelectItem value="staff">Staff Members</SelectItem>
              <SelectItem value="resident">Residents</SelectItem>
              <SelectItem value="anyone">Anyone</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-2">
        <Label>Name this trigger</Label>
        <Input 
          placeholder="Trigger name" 
          value={step.name}
          onChange={(e) => !readOnly && updateStep(step.id, { name: e.target.value })}
          readOnly={readOnly}
          className={readOnly ? "bg-gray-50" : ""}
        />
      </div>
    </div>
  );
};

export default TriggerStepContent;
