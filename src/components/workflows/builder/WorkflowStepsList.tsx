
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { WorkflowStep } from '@/types/workflow';
import WorkflowStepCard from './WorkflowStepCard';
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <div className="text-center py-10 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground mb-4">No workflow steps defined yet</p>
        {!readOnly && (
          <Button onClick={() => addStep('start')}>
            <Plus className="mr-2 h-4 w-4" />
            Add First Step
          </Button>
        )}
      </div>
    );
  }
  
  // Connection line
  const ConnectionLine = () => (
    <div className="flex justify-center my-1">
      <div className="h-6 w-0.5 bg-primary/30"></div>
    </div>
  );
  
  return (
    <ScrollArea className="h-[600px] px-4">
      <div className="space-y-0 mb-10">
        {workflowSteps.map((step, index) => (
          <React.Fragment key={step.id}>
            <WorkflowStepCard
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
            {index < workflowSteps.length - 1 && <ConnectionLine />}
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  );
};

export default WorkflowStepsList;
