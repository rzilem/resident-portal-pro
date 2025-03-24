
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, X, ChevronDown, ChevronUp, Save, Zap, Settings, Mail, Calendar, Bell, FileText, MessageSquare, User } from "lucide-react";

const TRIGGER_TYPES = [
  { id: 'time', label: 'Time-based', icon: <Calendar className="h-4 w-4" /> },
  { id: 'event', label: 'Event-based', icon: <Zap className="h-4 w-4" /> },
  { id: 'manual', label: 'Manual Trigger', icon: <User className="h-4 w-4" /> }
];

const ACTION_TYPES = [
  { id: 'email', label: 'Send Email', icon: <Mail className="h-4 w-4" /> },
  { id: 'notification', label: 'Send Notification', icon: <Bell className="h-4 w-4" /> },
  { id: 'task', label: 'Create Task', icon: <FileText className="h-4 w-4" /> },
  { id: 'message', label: 'Send Message', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'api', label: 'API Call', icon: <Zap className="h-4 w-4" /> },
  { id: 'update', label: 'Update Record', icon: <Settings className="h-4 w-4" /> }
];

const CONDITION_TYPES = [
  { id: 'equals', label: 'Equals' },
  { id: 'notEquals', label: 'Not Equals' },
  { id: 'contains', label: 'Contains' },
  { id: 'greaterThan', label: 'Greater Than' },
  { id: 'lessThan', label: 'Less Than' },
  { id: 'between', label: 'Between' },
  { id: 'isTrue', label: 'Is True' },
  { id: 'isFalse', label: 'Is False' }
];

// Define proper types for workflow steps
type WorkflowStep = 
  | { id: string; type: 'trigger'; triggerType: string; name: string; config: any }
  | { id: string; type: 'action'; actionType: string; name: string; config: any }
  | { id: string; type: 'condition'; conditionType: string; field: string; value: string; name: string; config: { trueSteps: any[]; falseSteps: any[] } };

const WorkflowBuilder = () => {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [workflowCategory, setWorkflowCategory] = useState('');
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    { id: '1', type: 'trigger', triggerType: '', name: '', config: {} },
    { id: '2', type: 'action', actionType: '', name: '', config: {} }
  ]);
  
  const addStep = (afterId: string) => {
    const newId = Date.now().toString();
    const afterIndex = workflowSteps.findIndex(step => step.id === afterId);
    
    const newSteps = [...workflowSteps];
    newSteps.splice(afterIndex + 1, 0, { 
      id: newId, 
      type: 'action', 
      actionType: '', 
      name: '',
      config: {}
    });
    
    setWorkflowSteps(newSteps);
  };
  
  const addCondition = (afterId: string) => {
    const newId = Date.now().toString();
    const afterIndex = workflowSteps.findIndex(step => step.id === afterId);
    
    const newSteps = [...workflowSteps];
    newSteps.splice(afterIndex + 1, 0, { 
      id: newId, 
      type: 'condition', 
      conditionType: 'equals', 
      field: '',
      value: '',
      name: 'If condition',
      config: {
        trueSteps: [],
        falseSteps: []
      }
    });
    
    setWorkflowSteps(newSteps);
  };
  
  const removeStep = (id: string) => {
    setWorkflowSteps(workflowSteps.filter(step => step.id !== id));
  };
  
  const moveStep = (id: string, direction: 'up' | 'down') => {
    const stepIndex = workflowSteps.findIndex(step => step.id === id);
    if ((direction === 'up' && stepIndex === 0) || 
        (direction === 'down' && stepIndex === workflowSteps.length - 1)) {
      return;
    }
    
    const newSteps = [...workflowSteps];
    const temp = newSteps[stepIndex];
    
    if (direction === 'up') {
      newSteps[stepIndex] = newSteps[stepIndex - 1];
      newSteps[stepIndex - 1] = temp;
    } else {
      newSteps[stepIndex] = newSteps[stepIndex + 1];
      newSteps[stepIndex + 1] = temp;
    }
    
    setWorkflowSteps(newSteps);
  };
  
  const updateStep = (id: string, data: Partial<WorkflowStep>) => {
    setWorkflowSteps(
      workflowSteps.map(step => 
        step.id === id ? { ...step, ...data } : step
      )
    );
  };
  
  const saveWorkflow = () => {
    const workflow = {
      name: workflowName,
      description: workflowDescription,
      category: workflowCategory,
      steps: workflowSteps,
      createdAt: new Date().toISOString()
    };
    
    console.log('Saving workflow:', workflow);
    // Here you would typically save to database or state
    alert('Workflow saved successfully!');
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workflow-name">Workflow Name</Label>
                <Input 
                  id="workflow-name" 
                  placeholder="Enter workflow name"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workflow-category">Category</Label>
                <Select value={workflowCategory} onValueChange={setWorkflowCategory}>
                  <SelectTrigger id="workflow-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                    <SelectItem value="governance">Governance</SelectItem>
                    <SelectItem value="resident">Resident Management</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workflow-description">Description</Label>
              <Textarea 
                id="workflow-description" 
                placeholder="Describe what this workflow does"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Workflow Steps</h2>
        <Button variant="outline" onClick={saveWorkflow}>
          <Save className="mr-2 h-4 w-4" />
          Save Workflow
        </Button>
      </div>
      
      <ScrollArea className="h-[500px] rounded-md border p-4">
        <div className="space-y-4">
          {workflowSteps.map((step, index) => (
            <Card key={step.id} className="relative border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {step.type === 'trigger' && (
                      <Zap className="h-5 w-5 text-yellow-500" />
                    )}
                    {step.type === 'action' && (
                      <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                        <ChevronDown className="h-3 w-3 text-white" />
                      </div>
                    )}
                    {step.type === 'condition' && (
                      <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <Settings className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <strong>Step {index + 1}: {step.name || step.type.charAt(0).toUpperCase() + step.type.slice(1)}</strong>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => moveStep(step.id, 'up')} disabled={index === 0}>
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => moveStep(step.id, 'down')} disabled={index === workflowSteps.length - 1}>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => removeStep(step.id)} disabled={workflowSteps.length <= 2}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Trigger Configuration */}
                {step.type === 'trigger' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Trigger Type</Label>
                      <Select 
                        value={step.triggerType} 
                        onValueChange={(value) => updateStep(step.id, { triggerType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select trigger type" />
                        </SelectTrigger>
                        <SelectContent>
                          {TRIGGER_TYPES.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              <div className="flex items-center">
                                {type.icon}
                                <span className="ml-2">{type.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {step.triggerType === 'time' && (
                      <div className="space-y-2">
                        <Label>Schedule</Label>
                        <Select defaultValue="daily">
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
                        <Select defaultValue="payment">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="payment">Payment Received</SelectItem>
                            <SelectItem value="violation">Violation Recorded</SelectItem>
                            <SelectItem value="request">Request Submitted</SelectItem>
                            <SelectItem value="resident">New Resident Added</SelectItem>
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
                        onChange={(e) => updateStep(step.id, { name: e.target.value })}
                      />
                    </div>
                  </div>
                )}
                
                {/* Action Configuration */}
                {step.type === 'action' && (
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
                                {type.icon}
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
                )}
                
                {/* Condition Configuration */}
                {step.type === 'condition' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-2">
                        <Label>Field</Label>
                        <Select defaultValue="paymentStatus">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="paymentStatus">Payment Status</SelectItem>
                            <SelectItem value="amount">Amount</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="residentType">Resident Type</SelectItem>
                            <SelectItem value="custom">Custom Field</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Condition</Label>
                        <Select 
                          value={(step as any).conditionType}
                          onValueChange={(value) => updateStep(step.id, { conditionType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CONDITION_TYPES.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Value</Label>
                        <Input placeholder="Condition value" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Name this condition</Label>
                      <Input 
                        placeholder="Condition name" 
                        value={step.name}
                        onChange={(e) => updateStep(step.id, { name: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
              
              <div className="flex justify-center p-2 border-t">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Plus className="mr-1 h-4 w-4" />
                      Add Step Below
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Step</DialogTitle>
                      <DialogDescription>
                        Choose the type of step to add after this one
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <Button onClick={() => { addStep(step.id); document.body.click(); }} className="justify-start">
                        <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center mr-2">
                          <ChevronDown className="h-4 w-4 text-white" />
                        </div>
                        Action
                      </Button>
                      <Button onClick={() => { addCondition(step.id); document.body.click(); }} className="justify-start">
                        <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                          <Settings className="h-4 w-4 text-white" />
                        </div>
                        Condition
                      </Button>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => document.body.click()}>Cancel</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default WorkflowBuilder;
