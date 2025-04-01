
import { useCallback } from 'react';
import { WorkflowStep, StepExecutionLog, ApprovalStep } from '@/types/workflow';
import { executeAction, evaluateCondition, initiateApproval } from '@/utils/workflow-execution-utils';

export function useWorkflowStepExecution() {
  /**
   * Execute a single workflow step
   */
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
      } else if (step.type === 'approval') {
        output = await initiateApproval(step as ApprovalStep);
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

  return {
    executeStep
  };
}
