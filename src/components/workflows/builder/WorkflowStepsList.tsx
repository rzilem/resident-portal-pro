
import React from 'react';
import { WorkflowStep } from '@/types/workflow';
import WorkflowStepCard from './WorkflowStepCard';

interface WorkflowStepsListProps {
  workflowSteps: WorkflowStep[];
  updateStep: (id: string, data: Partial<WorkflowStep>) => void;
  removeStep: (id: string) => void;
  moveStep: (id: string, direction: 'up' | 'down') => void;
  addStep: (afterId: string) => void;
  addCondition: (afterId: string) => void;
  readOnly?: boolean;
}

const WorkflowStepsList: React.FC<WorkflowStepsListProps> = ({
  workflowSteps,
  updateStep,
  removeStep,
  moveStep,
  addStep,
  addCondition,
  readOnly = false
}) => {
  return (
    <div className="space-y-6">
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
      
      {workflowSteps.length === 0 && (
        <div className="text-center py-10 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No steps defined for this workflow</p>
          {!readOnly && (
            <button 
              className="mt-2 text-primary hover:underline"
              onClick={() => addStep('start')}
            >
              Add first step
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkflowStepsList;
