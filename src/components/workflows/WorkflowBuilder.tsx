
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft } from "lucide-react";
import WorkflowHeader from './builder/WorkflowHeader';
import WorkflowStepsList from './builder/WorkflowStepsList';
import { WorkflowStep, Workflow } from '@/types/workflow';
import { toast } from "sonner";
import { useWorkflowSteps } from '@/hooks/use-workflow-steps';
import { useWorkflows } from '@/hooks/use-workflows';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

const WorkflowBuilder = () => {
  const [searchParams] = useSearchParams();
  const workflowId = searchParams.get('id');
  const readOnly = searchParams.get('readonly') === 'true';
  
  const { workflows, updateWorkflow, createWorkflow } = useWorkflows();
  const navigate = useNavigate();
  
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [workflowCategory, setWorkflowCategory] = useState('');
  const [workflowStatus, setWorkflowStatus] = useState<'active' | 'inactive' | 'draft'>('draft');
  
  // Get steps from the hook
  const { 
    steps: workflowSteps, 
    addStep, 
    removeStep, 
    updateStep, 
    moveStep,
    setWorkflowSteps
  } = useWorkflowSteps([
    { id: uuid(), type: 'trigger', triggerType: '', name: 'Start', config: {} },
    { id: uuid(), type: 'action', actionType: '', name: 'New Action', config: {} }
  ]);
  
  // Create a workflow object from current state
  const workflow: Workflow = {
    id: workflowId || uuid(),
    name: workflowName,
    description: workflowDescription,
    category: workflowCategory,
    steps: workflowSteps,
    status: workflowStatus,
    createdAt: new Date().toISOString(),
    lastEditedAt: new Date().toISOString()
  };
  
  // Load workflow data if editing
  useEffect(() => {
    if (workflowId) {
      const existingWorkflow = workflows.find(w => w.id === workflowId);
      if (existingWorkflow) {
        setWorkflowName(existingWorkflow.name);
        setWorkflowDescription(existingWorkflow.description);
        setWorkflowCategory(existingWorkflow.category);
        setWorkflowStatus(existingWorkflow.status);
        setWorkflowSteps(existingWorkflow.steps);
      }
    }
  }, [workflowId, workflows, setWorkflowSteps]);
  
  const handleAddStep = (afterId: string) => {
    addStep(afterId, 'action');
  };
  
  const handleAddCondition = (afterId: string) => {
    addStep(afterId, 'condition');
  };
  
  const handleWorkflowNameChange = (name: string) => {
    setWorkflowName(name);
  };
  
  const handleWorkflowDescriptionChange = (description: string) => {
    setWorkflowDescription(description);
  };
  
  const handleWorkflowCategoryChange = (category: string) => {
    setWorkflowCategory(category);
  };
  
  const handleWorkflowStatusChange = (status: 'active' | 'inactive' | 'draft') => {
    setWorkflowStatus(status);
  };
  
  const saveWorkflow = async () => {
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
      if (step.type === 'trigger' && !step.triggerType) return true;
      if (step.type === 'action' && !step.actionType) return true;
      return false;
    });

    if (incompleteSteps.length > 0) {
      toast.error('Please complete all workflow steps');
      return;
    }

    try {
      if (workflowId) {
        // Update existing workflow
        await updateWorkflow(workflowId, {
          name: workflowName,
          description: workflowDescription,
          category: workflowCategory,
          steps: workflowSteps,
          status: workflowStatus
        });
        toast.success('Workflow updated successfully!');
      } else {
        // Create new workflow
        const newWorkflow = await createWorkflow({
          name: workflowName,
          description: workflowDescription,
          category: workflowCategory,
          steps: workflowSteps,
        });
        toast.success('Workflow created successfully!');
        
        // Navigate to the new workflow
        navigate(`/workflows?tab=builder&id=${newWorkflow.id}`);
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast.error('Failed to save workflow');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/workflows')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Workflows
        </Button>
      </div>
      
      <WorkflowHeader
        workflow={workflow}
        readOnly={readOnly}
        onNameChange={handleWorkflowNameChange}
        onDescriptionChange={handleWorkflowDescriptionChange}
        onCategoryChange={handleWorkflowCategoryChange}
        onStatusChange={handleWorkflowStatusChange}
        onSave={saveWorkflow}
      />
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Workflow Steps</h2>
        {!readOnly && (
          <Button variant="outline" onClick={saveWorkflow}>
            <Save className="mr-2 h-4 w-4" />
            Save Workflow
          </Button>
        )}
      </div>
      
      <WorkflowStepsList
        workflowSteps={workflowSteps}
        updateStep={updateStep}
        removeStep={removeStep}
        moveStep={moveStep}
        addStep={handleAddStep}
        addCondition={handleAddCondition}
        readOnly={readOnly}
      />
      
      {!readOnly && (
        <div className="flex justify-end mt-6">
          <Button variant="default" onClick={saveWorkflow}>
            <Save className="mr-2 h-4 w-4" />
            Save Workflow
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorkflowBuilder;
