
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  Settings, 
  Trash2, 
  Mail, 
  Clock, 
  Bell, 
  FileText, 
  MessageSquare, 
  Zap,
  SlidersHorizontal,
  UserCheck,
  Calendar,
  Send,
  Check,
  AlertTriangle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WorkflowStep } from '@/types/workflow';
import { ACTION_TYPES, TRIGGER_TYPES, CONDITION_TYPES } from './types';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WorkflowStepCardProps {
  step: WorkflowStep;
  index: number;
  totalSteps: number;
  updateStep: (id: string, data: Partial<WorkflowStep>) => void;
  removeStep: (id: string) => void;
  moveStep: (id: string, direction: 'up' | 'down') => void;
  addStep: (afterId: string) => void;
  addCondition: (afterId: string) => void;
  readOnly?: boolean;
}

const getStepIcon = (step: WorkflowStep) => {
  if (step.type === 'trigger') {
    switch (step.triggerType) {
      case 'time': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'event': return <Zap className="h-5 w-5 text-amber-500" />;
      case 'manual': return <UserCheck className="h-5 w-5 text-green-500" />;
      default: return <Calendar className="h-5 w-5 text-purple-500" />;
    }
  } else if (step.type === 'action') {
    switch (step.actionType) {
      case 'email': return <Mail className="h-5 w-5 text-blue-500" />;
      case 'notification': return <Bell className="h-5 w-5 text-red-500" />;
      case 'task': return <FileText className="h-5 w-5 text-green-500" />;
      case 'message': return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case 'api': return <Zap className="h-5 w-5 text-amber-500" />;
      case 'update': return <Settings className="h-5 w-5 text-gray-500" />;
      default: return <Send className="h-5 w-5 text-blue-500" />;
    }
  } else if (step.type === 'condition') {
    return <SlidersHorizontal className="h-5 w-5 text-amber-500" />;
  }
  
  return <Settings className="h-5 w-5" />;
};

const WorkflowStepCard: React.FC<WorkflowStepCardProps> = ({
  step,
  index,
  totalSteps,
  updateStep,
  removeStep,
  moveStep,
  addStep,
  addCondition,
  readOnly = false
}) => {
  const [configTab, setConfigTab] = useState<string>('basic');
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateStep(step.id, { name: e.target.value });
  };
  
  const handleTypeChange = (value: string) => {
    if (step.type === 'trigger') {
      updateStep(step.id, { triggerType: value });
    } else if (step.type === 'action') {
      updateStep(step.id, { actionType: value });
    } else if (step.type === 'condition') {
      updateStep(step.id, { conditionType: value });
    }
  };
  
  const handleConfigChange = (key: string, value: any) => {
    updateStep(step.id, { 
      config: {
        ...step.config,
        [key]: value
      }
    });
  };
  
  const handleFieldChange = (value: string) => {
    if (step.type === 'condition') {
      updateStep(step.id, { field: value });
    }
  };
  
  const handleValueChange = (value: string) => {
    if (step.type === 'condition') {
      updateStep(step.id, { value: value });
    }
  };
  
  const renderTriggerConfig = () => {
    if (step.type !== 'trigger') return null;
    
    if (step.triggerType === 'time') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select 
                value={step.config.frequency || 'daily'}
                onValueChange={(value) => handleConfigChange('frequency', value)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Time</Label>
              <Input 
                type="time"
                value={step.config.time || '09:00'}
                onChange={(e) => handleConfigChange('time', e.target.value)}
                disabled={readOnly}
              />
            </div>
          </div>
          
          {step.config.frequency === 'weekly' && (
            <div className="space-y-2">
              <Label>Day of Week</Label>
              <Select 
                value={step.config.dayOfWeek || 'monday'}
                onValueChange={(value) => handleConfigChange('dayOfWeek', value)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {step.config.frequency === 'monthly' && (
            <div className="space-y-2">
              <Label>Day of Month</Label>
              <Input 
                type="number"
                min="1"
                max="31"
                value={step.config.dayOfMonth || '1'}
                onChange={(e) => handleConfigChange('dayOfMonth', e.target.value)}
                disabled={readOnly}
              />
            </div>
          )}
        </div>
      );
    }
    
    if (step.triggerType === 'event') {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Event Type</Label>
            <Select 
              value={step.config.eventType || 'system.event'}
              onValueChange={(value) => handleConfigChange('eventType', value)}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system.event">System Event</SelectItem>
                <SelectItem value="user.action">User Action</SelectItem>
                <SelectItem value="data.change">Data Change</SelectItem>
                <SelectItem value="calendar.event">Calendar Event</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Event Name</Label>
            <Input 
              placeholder="Enter specific event name"
              value={step.config.eventName || ''}
              onChange={(e) => handleConfigChange('eventName', e.target.value)}
              disabled={readOnly}
            />
          </div>
        </div>
      );
    }
    
    if (step.triggerType === 'manual') {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Trigger Label</Label>
            <Input 
              placeholder="Button label for manual trigger"
              value={step.config.label || 'Run Workflow'}
              onChange={(e) => handleConfigChange('label', e.target.value)}
              disabled={readOnly}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Access Level</Label>
            <Select 
              value={step.config.accessLevel || 'admin'}
              onValueChange={(value) => handleConfigChange('accessLevel', value)}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Who can trigger" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin Only</SelectItem>
                <SelectItem value="board">Board Members</SelectItem>
                <SelectItem value="committee">Committee Members</SelectItem>
                <SelectItem value="all">All Users</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }
    
    return (
      <div className="p-4 bg-muted/20 rounded-md text-center text-muted-foreground">
        Select a trigger type to configure
      </div>
    );
  };
  
  const renderActionConfig = () => {
    if (step.type !== 'action') return null;
    
    if (step.actionType === 'email') {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Email Template</Label>
            <Select 
              value={step.config.templateId || ''}
              onValueChange={(value) => handleConfigChange('templateId', value)}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select email template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payment-reminder">Payment Reminder</SelectItem>
                <SelectItem value="violation-notice">Violation Notice</SelectItem>
                <SelectItem value="meeting-invite">Meeting Invitation</SelectItem>
                <SelectItem value="welcome">Welcome Email</SelectItem>
                <SelectItem value="custom">Custom Template</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {step.config.templateId === 'custom' && (
            <>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input 
                  placeholder="Email subject"
                  value={step.config.subject || ''}
                  onChange={(e) => handleConfigChange('subject', e.target.value)}
                  disabled={readOnly}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Body</Label>
                <Textarea 
                  placeholder="Email body"
                  value={step.config.body || ''}
                  onChange={(e) => handleConfigChange('body', e.target.value)}
                  rows={4}
                  disabled={readOnly}
                />
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label>Recipients</Label>
            <Select 
              value={step.config.recipients || 'property-owner'}
              onValueChange={(value) => handleConfigChange('recipients', value)}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recipients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="property-owner">Property Owner</SelectItem>
                <SelectItem value="board-members">Board Members</SelectItem>
                <SelectItem value="committee-members">Committee Members</SelectItem>
                <SelectItem value="all-residents">All Residents</SelectItem>
                <SelectItem value="custom-list">Custom List</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }
    
    if (step.actionType === 'notification') {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Notification Title</Label>
            <Input 
              placeholder="Title"
              value={step.config.title || ''}
              onChange={(e) => handleConfigChange('title', e.target.value)}
              disabled={readOnly}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea 
              placeholder="Notification message"
              value={step.config.message || ''}
              onChange={(e) => handleConfigChange('message', e.target.value)}
              rows={3}
              disabled={readOnly}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Type</Label>
            <Select 
              value={step.config.type || 'info'}
              onValueChange={(value) => handleConfigChange('type', value)}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Information</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }
    
    if (step.actionType === 'task') {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Task Title</Label>
            <Input 
              placeholder="Title"
              value={step.config.title || ''}
              onChange={(e) => handleConfigChange('title', e.target.value)}
              disabled={readOnly}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              placeholder="Task description"
              value={step.config.description || ''}
              onChange={(e) => handleConfigChange('description', e.target.value)}
              rows={3}
              disabled={readOnly}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Assigned To</Label>
            <Select 
              value={step.config.assignedTo || ''}
              onValueChange={(value) => handleConfigChange('assignedTo', value)}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager">Property Manager</SelectItem>
                <SelectItem value="board">Board President</SelectItem>
                <SelectItem value="maintenance">Maintenance Staff</SelectItem>
                <SelectItem value="custom">Custom User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Due Date (Days from Today)</Label>
            <Input 
              type="number"
              min="1"
              value={step.config.dueDays || '7'}
              onChange={(e) => handleConfigChange('dueDays', e.target.value)}
              disabled={readOnly}
            />
          </div>
        </div>
      );
    }
    
    // Similar patterns for other action types...
    
    return (
      <div className="p-4 bg-muted/20 rounded-md text-center text-muted-foreground">
        Select an action type to configure
      </div>
    );
  };
  
  const renderConditionConfig = () => {
    if (step.type !== 'condition') return null;
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Field</Label>
          <Input 
            placeholder="Field to check"
            value={step.field || ''}
            onChange={(e) => handleFieldChange(e.target.value)}
            disabled={readOnly}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Condition</Label>
          <Select 
            value={step.conditionType}
            onValueChange={handleTypeChange}
            disabled={readOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {CONDITION_TYPES.map(condition => (
                <SelectItem key={condition.id} value={condition.id}>
                  {condition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Value</Label>
          <Input 
            placeholder="Value to compare"
            value={step.value || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={readOnly}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="border rounded p-3">
            <div className="flex items-center text-green-600 mb-2">
              <Check className="h-4 w-4 mr-2" />
              <Label className="font-medium">If True</Label>
            </div>
            <p className="text-xs text-muted-foreground">
              {step.config.trueSteps?.length 
                ? `${step.config.trueSteps.length} steps configured` 
                : "No steps configured yet"}
            </p>
          </div>
          
          <div className="border rounded p-3">
            <div className="flex items-center text-amber-600 mb-2">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <Label className="font-medium">If False</Label>
            </div>
            <p className="text-xs text-muted-foreground">
              {step.config.falseSteps?.length 
                ? `${step.config.falseSteps.length} steps configured` 
                : "No steps configured yet"}
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="relative border-2">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-md bg-muted">
            {getStepIcon(step)}
          </div>
          
          <div className="flex-1">
            <Input
              className="font-medium"
              value={step.name}
              onChange={handleNameChange}
              disabled={readOnly}
            />
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => moveStep(step.id, 'up')}
              disabled={index === 0 || readOnly}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => moveStep(step.id, 'down')}
              disabled={index === totalSteps - 1 || readOnly}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="space-y-2">
            {step.type === 'trigger' && (
              <Select 
                value={step.triggerType}
                onValueChange={handleTypeChange}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger type" />
                </SelectTrigger>
                <SelectContent>
                  {TRIGGER_TYPES.map(trigger => (
                    <SelectItem key={trigger.id} value={trigger.id}>
                      {trigger.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {step.type === 'action' && (
              <Select 
                value={step.actionType}
                onValueChange={handleTypeChange}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent>
                  {ACTION_TYPES.map(action => (
                    <SelectItem key={action.id} value={action.id}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          <Tabs value={configTab} onValueChange={setConfigTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Config</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="p-4 border rounded-md mt-2">
              {step.type === 'trigger' && renderTriggerConfig()}
              {step.type === 'action' && renderActionConfig()}
              {step.type === 'condition' && renderConditionConfig()}
            </TabsContent>
            
            <TabsContent value="advanced" className="p-4 border rounded-md mt-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Step ID</Label>
                  <Input value={step.id} disabled />
                </div>
                
                <div className="space-y-2">
                  <Label>Step Type</Label>
                  <Input value={step.type} disabled />
                </div>
                
                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Textarea 
                    placeholder="Add notes about this step..."
                    value={step.config.notes || ''}
                    onChange={(e) => handleConfigChange('notes', e.target.value)}
                    disabled={readOnly}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      
      {!readOnly && (
        <CardFooter className="pt-2 flex justify-between">
          <div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => removeStep(step.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => addCondition(step.id)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Add Condition
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => addStep(step.id)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default WorkflowStepCard;
