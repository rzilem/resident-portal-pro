
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import WorkflowHeader from './builder/WorkflowHeader';
import WorkflowStepsList from './builder/WorkflowStepsList';
import { WorkflowStep, TriggerStep, ActionStep, ConditionStep } from './builder/types';
import { toast } from "sonner";

const WorkflowBuilder = () => {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [workflowCategory, setWorkflowCategory] = useState('');
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    { id: '1', type: 'trigger', triggerType: '', name: '', config: {} } as TriggerStep,
    { id: '2', type: 'action', actionType: '', name: '', config: {} } as ActionStep
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
    } as ActionStep);
    
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
    } as ConditionStep);
    
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
      workflowSteps.map(step => {
        if (step.id === id) {
          return { ...step, ...data } as WorkflowStep;
        }
        return step;
      })
    );
  };
  
  const saveWorkflow = () => {
    // Validate required fields before saving
    if (!workflowName.trim()) {
      toast.error('Please enter a workflow name');
      return;
    }

    if (!workflowCategory) {
      toast.error('Please select a workflow category');
      return;
    }

    // Check if all steps have necessary properties filled
    const incompleteSteps = workflowSteps.filter(step => {
      if (step.type === 'trigger' && !(step as TriggerStep).triggerType) return true;
      if (step.type === 'action' && !(step as ActionStep).actionType) return true;
      return false;
    });

    if (incompleteSteps.length > 0) {
      toast.error('Please complete all workflow steps');
      return;
    }

    const workflow = {
      name: workflowName,
      description: workflowDescription,
      category: workflowCategory,
      steps: workflowSteps,
      createdAt: new Date().toISOString()
    };
    
    console.log('Saving workflow:', workflow);
    // Here you would typically save to database or state
    toast.success('Workflow saved successfully!');
  };
  
  return (
    <div className="space-y-6">
      <WorkflowHeader
        workflowName={workflowName}
        setWorkflowName={setWorkflowName}
        workflowDescription={workflowDescription}
        setWorkflowDescription={setWorkflowDescription}
        workflowCategory={workflowCategory}
        setWorkflowCategory={setWorkflowCategory}
      />
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Workflow Steps</h2>
        <Button variant="outline" onClick={saveWorkflow}>
          <Save className="mr-2 h-4 w-4" />
          Save Workflow
        </Button>
      </div>
      
      <WorkflowStepsList
        workflowSteps={workflowSteps}
        updateStep={updateStep}
        removeStep={removeStep}
        moveStep={moveStep}
        addStep={addStep}
        addCondition={addCondition}
      />
    </div>
  );
};

export default WorkflowBuilder;
