
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, X, ChevronDown, ChevronUp, Settings, Zap } from "lucide-react";
import { WorkflowStep } from '@/types/workflow';
import TriggerStepContent from './TriggerStepContent';
import ActionStepContent from './ActionStepContent';
import ConditionStepContent from './ConditionStepContent';

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

const WorkflowStepCard = ({
  step,
  index,
  totalSteps,
  updateStep,
  removeStep,
  moveStep,
  addStep,
  addCondition,
  readOnly = false
}: WorkflowStepCardProps) => {
  const renderStepIcon = () => {
    if (step.type === 'trigger') {
      return <Zap className="h-5 w-5 text-yellow-500" />;
    } else if (step.type === 'action') {
      return (
        <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
          <ChevronDown className="h-3 w-3 text-white" />
        </div>
      );
    } else if (step.type === 'condition') {
      return (
        <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
          <Settings className="h-3 w-3 text-white" />
        </div>
      );
    }
    return null;
  };

  const renderStepContent = () => {
    if (step.type === 'trigger') {
      return <TriggerStepContent step={step} updateStep={updateStep} readOnly={readOnly} />;
    } else if (step.type === 'action') {
      return <ActionStepContent step={step} updateStep={updateStep} readOnly={readOnly} />;
    } else if (step.type === 'condition') {
      return <ConditionStepContent step={step} updateStep={updateStep} readOnly={readOnly} />;
    }
    return null;
  };

  return (
    <Card className="relative border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {renderStepIcon()}
            <strong>Step {index + 1}: {step.name || step.type.charAt(0).toUpperCase() + step.type.slice(1)}</strong>
          </div>
          
          {!readOnly && (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => moveStep(step.id, 'up')} disabled={index === 0}>
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => moveStep(step.id, 'down')} disabled={index === totalSteps - 1}>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => removeStep(step.id)} disabled={totalSteps <= 2}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        {renderStepContent()}
      </CardContent>
      
      {!readOnly && (
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
      )}
    </Card>
  );
};

export default WorkflowStepCard;
