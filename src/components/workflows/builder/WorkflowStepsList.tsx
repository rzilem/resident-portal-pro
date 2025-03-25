
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { WorkflowStep } from './types';
import WorkflowStepCard from './WorkflowStepCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Pencil } from 'lucide-react';

interface WorkflowStepsListProps {
  workflowSteps: WorkflowStep[];
  updateStep: (id: string, data: Partial<WorkflowStep>) => void;
  removeStep: (id: string) => void;
  moveStep: (id: string, direction: 'up' | 'down') => void;
  addStep: (afterId: string) => void;
  addCondition: (afterId: string) => void;
  readOnly?: boolean;
}

const WorkflowStepsList = ({
  workflowSteps,
  updateStep,
  removeStep,
  moveStep,
  addStep,
  addCondition,
  readOnly = false
}: WorkflowStepsListProps) => {
  if (workflowSteps.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No steps defined yet. Start by adding steps to your workflow.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <>
      {readOnly && (
        <Alert className="mb-4">
          <Pencil className="h-4 w-4 mr-2" />
          <AlertDescription>
            You are viewing this workflow in read-only mode. Switch to edit mode to make changes.
          </AlertDescription>
        </Alert>
      )}
      
      <ScrollArea className="h-[500px] rounded-md border p-4">
        <div className="space-y-4">
          {workflowSteps.map((step, index) => (
            <WorkflowStepCard
              key={step.id}
              step={step}
              index={index}
              totalSteps={workflowSteps.length}
              updateStep={updateStep}
              removeStep={removeStep}
              moveStep={moveStep}
              addStep={addStep}
              addCondition={addCondition}
              readOnly={readOnly}
            />
          ))}
        </div>
      </ScrollArea>
    </>
  );
};

export default WorkflowStepsList;
