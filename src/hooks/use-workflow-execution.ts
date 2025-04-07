
import { useState, useCallback } from 'react';
import { Workflow, WorkflowExecutionLog, ApprovalStep } from '@/types/workflow';
import { v4 as uuid } from 'uuid';
import { toast } from "sonner";
import { useAuth } from '@/hooks/use-auth';
import { useWorkflowStepExecution } from './use-workflow-step-execution';
import { useWorkflowApprovals } from './use-workflow-approvals';

export function useWorkflowExecution() {
  const { user } = useAuth();
  const [executionLogs, setExecutionLogs] = useState<WorkflowExecutionLog[]>([]);
  const [currentExecution, setCurrentExecution] = useState<WorkflowExecutionLog | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  
  const { executeStep } = useWorkflowStepExecution();
  const { pendingApprovals, addPendingApproval, processApproval } = useWorkflowApprovals();
  
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
        
        // If step is an approval and is pending, pause workflow execution
        if (step.type === 'approval' && stepResult.output?.status === 'pending') {
          // Add to pending approvals
          const approvalStep = { 
            ...step as ApprovalStep, 
            workflowId: workflow.id, 
            executionId 
          };
          
          addPendingApproval(approvalStep);
          
          // Pause execution and wait for approval
          toast.info(`Workflow "${workflow.name}" is awaiting approval from ${(step as ApprovalStep).requiredApprovals} approver(s)`);
          
          // Mark execution as pending
          const pendingExecution: WorkflowExecutionLog = {
            ...newExecution,
            status: 'pending',
            pausedAt: new Date().toISOString()
          };
          
          setCurrentExecution(pendingExecution);
          setExecutionLogs(prev => {
            const updated = [...prev];
            const executionIndex = updated.findIndex(e => e.id === executionId);
            
            if (executionIndex >= 0) {
              updated[executionIndex] = pendingExecution;
            }
            
            return updated;
          });
          
          // Return the execution but don't mark as completed
          return pendingExecution;
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
  }, [executeStep, addPendingApproval, user]);
  
  return {
    executeWorkflow,
    executeStep,
    executionLogs,
    currentExecution,
    isExecuting,
    pendingApprovals,
    processApproval
  };
}
