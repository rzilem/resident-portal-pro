import { useState, useCallback } from 'react';
import { Workflow, WorkflowStep, WorkflowExecutionLog, StepExecutionLog, ApprovalStep, ApprovalRecord } from '@/types/workflow';
import { v4 as uuid } from 'uuid';
import { toast } from "sonner";
import { useAuth } from '@/hooks/use-auth';
import { adaptSupabaseUser } from '@/utils/user-helpers';

export function useWorkflowExecution() {
  const { user: supabaseUser } = useAuth();
  const user = adaptSupabaseUser(supabaseUser);
  const [executionLogs, setExecutionLogs] = useState<WorkflowExecutionLog[]>([]);
  const [currentExecution, setCurrentExecution] = useState<WorkflowExecutionLog | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalStep[]>([]);
  
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
          
          setPendingApprovals(prev => [...prev, approvalStep]);
          
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
  }, [user]);
  
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
  
  // Initiate an approval step
  const initiateApproval = async (step: ApprovalStep): Promise<any> => {
    // In a real implementation, this would create approval requests in the database
    // and notify approvers via email/notifications
    
    // For now, we'll simulate the approval process
    const approvalId = uuid();
    
    // Initialize approvals array if not present
    const approvals = step.approvals || [];
    
    // Return approval status and details
    return {
      approvalId,
      status: 'pending',
      requiredApprovals: step.requiredApprovals,
      approverRoles: step.approverRoles,
      approvals,
      initiated: new Date().toISOString()
    };
  };
  
  // Process an approval action (approve or reject)
  const processApproval = useCallback(async (
    approvalStep: ApprovalStep,
    action: 'approve' | 'reject',
    comments?: string
  ) => {
    if (!user) {
      toast.error('You must be logged in to process approvals');
      return null;
    }
    
    try {
      // In a real implementation, this would update the approval status in the database
      
      // Create a new approval record
      const approvalRecord: ApprovalRecord = {
        approverId: user.id,
        approverName: user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email,
        approverRole: user.role,
        status: action === 'approve' ? 'approved' : 'rejected',
        timestamp: new Date().toISOString(),
        comments
      };
      
      // Update the approval step with the new record
      const updatedApprovals = [...(approvalStep.approvals || []), approvalRecord];
      const updatedStep: ApprovalStep = {
        ...approvalStep,
        approvals: updatedApprovals
      };
      
      // Check if we have enough approvals
      const approvedCount = updatedApprovals.filter(a => a.status === 'approved').length;
      
      if (action === 'reject') {
        // If rejected, immediately mark as rejected
        updatedStep.status = 'rejected';
      } else if (approvedCount >= approvalStep.requiredApprovals) {
        // If we have enough approvals, mark as approved
        updatedStep.status = 'approved';
      } else {
        // Still waiting for more approvals
        updatedStep.status = 'pending';
      }
      
      // Update the pending approvals list
      setPendingApprovals(prev => prev.map(step => 
        step.id === approvalStep.id ? updatedStep : step
      ));
      
      // In a real implementation, we would continue the workflow execution
      // based on the approval result (following either approvedSteps or rejectedSteps)
      
      toast.success(`Successfully ${action === 'approve' ? 'approved' : 'rejected'} "${approvalStep.name}"`);
      
      return updatedStep;
    } catch (error) {
      console.error('Error processing approval:', error);
      toast.error(`Failed to ${action} the approval: ${error.message}`);
      return null;
    }
  }, [user]);
  
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
    isExecuting,
    pendingApprovals,
    processApproval
  };
}
