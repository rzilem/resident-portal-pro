
import { useState, useCallback } from 'react';
import { ApprovalStep, ApprovalRecord } from '@/types/workflow';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { v4 as uuid } from 'uuid';

export function useWorkflowApprovals() {
  const { user } = useAuth();
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalStep[]>([]);

  /**
   * Add a step to the pending approvals queue
   */
  const addPendingApproval = useCallback((approvalStep: ApprovalStep) => {
    setPendingApprovals(prev => [...prev, approvalStep]);
  }, []);

  /**
   * Process an approval action (approve or reject)
   */
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

  return {
    pendingApprovals,
    addPendingApproval,
    processApproval
  };
}
