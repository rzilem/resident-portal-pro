
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { WorkflowStep } from './types';
import WorkflowStepCard from './WorkflowStepCard';

interface WorkflowStepsListProps {
  workflowSteps: WorkflowStep[];
  updateStep: (id: string, data: Partial<WorkflowStep>) => void;
  removeStep: (id: string) => void;
  moveStep: (id: string, direction: 'up' | 'down') => void;
  addStep: (afterId: string) => void;
  addCondition: (afterId: string) => void;
}

const WorkflowStepsList = ({
  workflowSteps,
  updateStep,
  removeStep,
  moveStep,
  addStep,
  addCondition
}: WorkflowStepsListProps) => {
  return (
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
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default WorkflowStepsList;
