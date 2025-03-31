
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TriggerStep, TRIGGER_TYPES } from './types';
import { Calendar, Zap, User } from 'lucide-react';

interface TriggerStepContentProps {
  step: TriggerStep;
  updateStep: (id: string, data: Partial<TriggerStep>) => void;
  readOnly?: boolean;
}

const TriggerStepContent = ({ step, updateStep, readOnly = false }: TriggerStepContentProps) => {
  // Function to render the appropriate icon for the trigger type
  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case 'Calendar': return <Calendar className="h-4 w-4" />;
      case 'Zap': return <Zap className="h-4 w-4" />;
      case 'User': return <User className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Trigger Type</Label>
        <Select 
          value={step.triggerType}
          onValueChange={(value) => !readOnly && updateStep(step.id, { triggerType: value })}
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
        <div className="space-y-2">
          <Label>Time Configuration</Label>
          <Select defaultValue="daily" disabled={readOnly}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="custom">Custom Schedule</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      {step.triggerType === 'event' && (
        <div className="space-y-2">
          <Label>Event Type</Label>
          <Select defaultValue="created" disabled={readOnly}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Record Created</SelectItem>
              <SelectItem value="updated">Record Updated</SelectItem>
              <SelectItem value="deleted">Record Deleted</SelectItem>
              <SelectItem value="statusChanged">Status Changed</SelectItem>
              <SelectItem value="custom">Custom Event</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-2">
        <Label>Name this trigger</Label>
        <Input 
          placeholder="Trigger name" 
          value={step.name}
          onChange={(e) => !readOnly && updateStep(step.id, { name: e.target.name ? e.target.value : 'Start' })}
          readOnly={readOnly}
          className={readOnly ? "bg-gray-50" : ""}
        />
      </div>
    </div>
  );
};

export default TriggerStepContent;
