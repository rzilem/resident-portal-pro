
import { useState, useCallback } from 'react';
import { WorkflowStep } from '@/types/workflow';
import { v4 as uuid } from 'uuid';

export function useWorkflowSteps(initialSteps: WorkflowStep[] = []) {
  const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps);
  
  // Add a step after a specific step
  const addStep = useCallback((afterId: string, stepType: 'action' | 'condition' = 'action') => {
    const afterIndex = steps.findIndex(step => step.id === afterId);
    if (afterIndex === -1) return;
    
    const newStep: WorkflowStep = stepType === 'action' 
      ? {
          id: uuid(),
          type: 'action',
          actionType: '',
          name: 'New Action',
          config: {}
        }
      : {
          id: uuid(),
          type: 'condition',
          conditionType: 'equals',
          name: 'New Condition',
          field: '',
          value: '',
          config: {
            trueSteps: [],
            falseSteps: []
          }
        };
    
    const newSteps = [...steps];
    newSteps.splice(afterIndex + 1, 0, newStep);
    setSteps(newSteps);
    
    return newStep;
  }, [steps]);
  
  // Remove a step
  const removeStep = useCallback((id: string) => {
    setSteps(prevSteps => prevSteps.filter(step => step.id !== id));
  }, []);
  
  // Update a step
  const updateStep = useCallback((id: string, updates: Partial<WorkflowStep>) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === id ? { ...step, ...updates } as WorkflowStep : step
      )
    );
  }, []);
  
  // Move a step up or down
  const moveStep = useCallback((id: string, direction: 'up' | 'down') => {
    const index = steps.findIndex(step => step.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === steps.length - 1)
    ) {
      return;
    }
    
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap positions
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    
    setSteps(newSteps);
  }, [steps]);
  
  // Reset steps
  const resetSteps = useCallback(() => {
    setSteps([]);
  }, []);
  
  // Set steps directly
  const setWorkflowSteps = useCallback((newSteps: WorkflowStep[]) => {
    setSteps(newSteps);
  }, []);
  
  return {
    steps,
    addStep,
    removeStep,
    updateStep,
    moveStep,
    resetSteps,
    setWorkflowSteps
  };
}
