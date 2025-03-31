
import { useState, useCallback } from 'react';
import { Workflow, WorkflowStep, WorkflowExecutionLog, StepExecutionLog } from '@/types/workflow';
import { v4 as uuid } from 'uuid';
import { toast } from "sonner";

export function useWorkflowExecution() {
  const [executionLogs, setExecutionLogs] = useState<WorkflowExecutionLog[]>([]);
  const [currentExecution, setCurrentExecution] = useState<WorkflowExecutionLog | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  
  // Execute an entire workflow
  const executeWorkflow = useCallback(async (workflow: Workflow) => {
    // Only run active workflows
    if (workflow.status !== 'active') {
      toast.error(`Cannot execute workflow "${workflow.name}" because it is not active`);
      return null;
    }
    
    setIsExecuting(true);
    
    // Create a new execution log
    const executionId = uuid();
    const newExecution: WorkflowExecutionLog = {
      id: executionId,
      workflowId: workflow.id,
      started: new Date().toISOString(),
      status: 'running',
      stepLogs: []
    };
    
    setCurrentExecution(newExecution);
    setExecutionLogs(prev => [...prev, newExecution]);
    
    toast.info(`Executing workflow: ${workflow.name}`);
    
    try {
      // Execute each step in sequence
      for (const step of workflow.steps) {
        const stepResult = await executeStep(workflow.id, step, executionId);
        
        // Update execution log with step result
        setExecutionLogs(prev => {
          const updated = [...prev];
          const executionIndex = updated.findIndex(e => e.id === executionId);
          
          if (executionIndex >= 0) {
            updated[executionIndex].stepLogs.push(stepResult);
          }
          
          return updated;
        });
        
        setCurrentExecution(prev => {
          if (prev?.id === executionId) {
            return {
              ...prev,
              stepLogs: [...prev.stepLogs, stepResult]
            };
          }
          return prev;
        });
        
        // If step failed, stop execution
        if (stepResult.status === 'failed') {
          throw new Error(`Step "${step.name}" failed: ${stepResult.error}`);
        }
      }
      
      // Mark execution as completed
      const completedExecution = {
        ...newExecution,
        completed: new Date().toISOString(),
        status: 'completed' as const
      };
      
      setCurrentExecution(completedExecution);
      setExecutionLogs(prev => {
        const updated = [...prev];
        const executionIndex = updated.findIndex(e => e.id === executionId);
        
        if (executionIndex >= 0) {
          updated[executionIndex] = completedExecution;
        }
        
        return updated;
      });
      
      toast.success(`Workflow "${workflow.name}" executed successfully`);
      
      return completedExecution;
    } catch (error) {
      console.error('Workflow execution error:', error);
      
      // Mark execution as failed
      const failedExecution = {
        ...newExecution,
        completed: new Date().toISOString(),
        status: 'failed' as const
      };
      
      setCurrentExecution(failedExecution);
      setExecutionLogs(prev => {
        const updated = [...prev];
        const executionIndex = updated.findIndex(e => e.id === executionId);
        
        if (executionIndex >= 0) {
          updated[executionIndex] = failedExecution;
        }
        
        return updated;
      });
      
      toast.error(`Workflow execution failed: ${error.message}`);
      
      return failedExecution;
    } finally {
      setIsExecuting(false);
    }
  }, []);
  
  // Execute a single workflow step
  const executeStep = useCallback(async (
    workflowId: string,
    step: WorkflowStep,
    executionId: string
  ): Promise<StepExecutionLog> => {
    // Create step execution log
    const stepLog: StepExecutionLog = {
      stepId: step.id,
      started: new Date().toISOString(),
      status: 'running'
    };
    
    try {
      console.log(`Executing step: ${step.name} (${step.type})`);
      
      // Implementation of step execution based on type
      let output: any = {};
      
      if (step.type === 'action') {
        output = await executeAction(step);
      } else if (step.type === 'condition') {
        output = await evaluateCondition(step);
      } else if (step.type === 'trigger') {
        // Triggers are usually handled separately, but we'll simulate it
        output = { triggered: true, timestamp: new Date().toISOString() };
      }
      
      // Simulate step execution time (remove in production)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update step log
      const completedStepLog: StepExecutionLog = {
        ...stepLog,
        completed: new Date().toISOString(),
        status: 'completed',
        output
      };
      
      return completedStepLog;
    } catch (error) {
      console.error(`Error executing step ${step.name}:`, error);
      
      // Return failed step log
      return {
        ...stepLog,
        completed: new Date().toISOString(),
        status: 'failed',
        error: error.message
      };
    }
  }, []);
  
  // Helper function to execute an action step
  const executeAction = async (step: WorkflowStep): Promise<any> => {
    if (step.type !== 'action') return {};
    
    switch (step.actionType) {
      case 'email':
        console.log('Sending email:', step.config);
        // Simulate email sending
        return { 
          sent: true,
          to: step.config.recipients || 'all',
          templateId: step.config.templateId,
          timestamp: new Date().toISOString()
        };
        
      case 'notification':
        console.log('Sending notification:', step.config);
        // Simulate notification
        toast[step.config.type || 'info'](
          step.config.title || 'Workflow Notification',
          { description: step.config.message || 'Notification from workflow' }
        );
        return { 
          notified: true,
          type: step.config.type || 'info',
          timestamp: new Date().toISOString()
        };
        
      case 'task':
        console.log('Creating task:', step.config);
        // Simulate task creation
        return { 
          taskCreated: true,
          title: step.config.title,
          assignedTo: step.config.assignedTo,
          timestamp: new Date().toISOString()
        };
        
      default:
        return { executed: true, timestamp: new Date().toISOString() };
    }
  };
  
  // Helper function to evaluate a condition step
  const evaluateCondition = async (step: WorkflowStep): Promise<any> => {
    if (step.type !== 'condition') return {};
    
    // Implement condition evaluation logic
    let result = false;
    
    switch (step.conditionType) {
      case 'equals':
        // Compare field and value
        result = step.field === step.value;
        break;
        
      case 'notEquals':
        result = step.field !== step.value;
        break;
        
      case 'contains':
        result = step.field.includes(step.value);
        break;
        
      case 'greaterThan':
        result = Number(step.field) > Number(step.value);
        break;
        
      case 'lessThan':
        result = Number(step.field) < Number(step.value);
        break;
        
      case 'isTrue':
        result = Boolean(step.field);
        break;
        
      case 'isFalse':
        result = !Boolean(step.field);
        break;
        
      default:
        result = false;
    }
    
    // If condition is true, execute trueSteps, otherwise execute falseSteps
    // (In a real implementation, we would recursively execute these steps)
    
    return { 
      conditionResult: result,
      field: step.field,
      operator: step.conditionType,
      value: step.value,
      timestamp: new Date().toISOString()
    };
  };
  
  return {
    executeWorkflow,
    executeStep,
    executionLogs,
    currentExecution,
    isExecuting
  };
}
