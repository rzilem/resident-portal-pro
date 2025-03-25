
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TRIGGER_TYPES } from './types';
import { TriggerStep } from '@/types/workflow';

interface TriggerStepContentProps {
  step: TriggerStep;
  updateStep: (id: string, data: Partial<TriggerStep>) => void;
  readOnly?: boolean;
}

const TriggerStepContent = ({ step, updateStep, readOnly = false }: TriggerStepContentProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Trigger Type</Label>
          {readOnly ? (
            <Input 
              value={TRIGGER_TYPES.find(t => t.id === step.triggerType)?.label || step.triggerType || 'Not selected'} 
              readOnly 
              className="opacity-70" 
            />
          ) : (
            <Select 
              value={step.triggerType} 
              onValueChange={(value) => updateStep(step.id, { triggerType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a trigger type" />
              </SelectTrigger>
              <SelectContent>
                {TRIGGER_TYPES.map((trigger) => (
                  <SelectItem key={trigger.id} value={trigger.id}>
                    {trigger.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        <div className="space-y-2">
          <Label>Step Name</Label>
          <Input 
            value={step.name} 
            onChange={(e) => updateStep(step.id, { name: e.target.value })} 
            placeholder="Enter a name for this step"
            readOnly={readOnly}
            className={readOnly ? "opacity-70" : ""}
          />
        </div>
      </div>
      
      {/* Additional configuration based on trigger type */}
      {step.triggerType === 'time' && (
        <div className="space-y-4 mt-4 border-t pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Day of Month</Label>
              <Input 
                type="number" 
                min="1" 
                max="31" 
                value={step.config.day || ''} 
                onChange={(e) => updateStep(step.id, { 
                  config: { ...step.config, day: e.target.value } 
                })}
                readOnly={readOnly}
                className={readOnly ? "opacity-70" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Frequency</Label>
              {readOnly ? (
                <Input 
                  value={step.config.repeat || 'Not set'} 
                  readOnly 
                  className="opacity-70" 
                />
              ) : (
                <Select 
                  value={step.config.repeat || ''} 
                  onValueChange={(value) => updateStep(step.id, { 
                    config: { ...step.config, repeat: value } 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>
      )}
      
      {step.triggerType === 'event' && (
        <div className="space-y-4 mt-4 border-t pt-4">
          <div className="space-y-2">
            <Label>Event Type</Label>
            {readOnly ? (
              <Input 
                value={step.config.eventType || 'Not set'} 
                readOnly 
                className="opacity-70" 
              />
            ) : (
              <Select 
                value={step.config.eventType || ''} 
                onValueChange={(value) => updateStep(step.id, { 
                  config: { ...step.config, eventType: value } 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment.received">Payment Received</SelectItem>
                  <SelectItem value="payment.due">Payment Due</SelectItem>
                  <SelectItem value="resident.new">New Resident</SelectItem>
                  <SelectItem value="resident.status.change">Resident Status Change</SelectItem>
                  <SelectItem value="violation.reported">Violation Reported</SelectItem>
                  <SelectItem value="community.event.created">Community Event Created</SelectItem>
                  <SelectItem value="maintenance.request">Maintenance Request</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TriggerStepContent;
