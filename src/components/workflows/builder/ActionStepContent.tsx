
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActionStep, ACTION_TYPES } from './types';
import { Mail, Bell, FileText, MessageSquare, Zap, Settings } from 'lucide-react';

interface ActionStepContentProps {
  step: ActionStep;
  updateStep: (id: string, data: Partial<ActionStep>) => void;
}

const ActionStepContent = ({ step, updateStep }: ActionStepContentProps) => {
  // Function to render the appropriate icon for the action type
  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case 'Mail': return <Mail className="h-4 w-4" />;
      case 'Bell': return <Bell className="h-4 w-4" />;
      case 'FileText': return <FileText className="h-4 w-4" />;
      case 'MessageSquare': return <MessageSquare className="h-4 w-4" />;
      case 'Zap': return <Zap className="h-4 w-4" />;
      case 'Settings': return <Settings className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Action Type</Label>
        <Select 
          value={step.actionType}
          onValueChange={(value) => updateStep(step.id, { actionType: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select action type" />
          </SelectTrigger>
          <SelectContent>
            {ACTION_TYPES.map((type) => (
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
      
      {step.actionType === 'email' && (
        <div className="space-y-2">
          <Label>Email Template</Label>
          <Select defaultValue="reminder">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reminder">Payment Reminder</SelectItem>
              <SelectItem value="violation">Violation Notice</SelectItem>
              <SelectItem value="confirmation">Confirmation</SelectItem>
              <SelectItem value="welcome">Welcome Email</SelectItem>
              <SelectItem value="custom">Custom Template</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-2">
        <Label>Name this action</Label>
        <Input 
          placeholder="Action name" 
          value={step.name}
          onChange={(e) => updateStep(step.id, { name: e.target.value })}
        />
      </div>
    </div>
  );
};

export default ActionStepContent;
