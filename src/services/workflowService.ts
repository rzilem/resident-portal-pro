import { Workflow, WorkflowStep, WorkflowTemplate, ApprovalStep } from '@/types/workflow';
import { v4 as uuid } from 'uuid';
import { checkWorkflowProgressForAlert } from '@/utils/alerts/alertSolutions';
import { toast } from 'sonner';

// Simulated database of workflows
let workflows: Workflow[] = [];

// Import templates from our static data
import { workflowTemplates } from '@/data/workflowTemplates';

export const workflowService = {
  // Get all workflows
  getAllWorkflows: () => {
    return Promise.resolve([...workflows]);
  },

  // Get workflows by status
  getWorkflowsByStatus: (status: 'active' | 'inactive' | 'draft') => {
    return Promise.resolve(workflows.filter(w => w.status === status));
  },

  // Get workflow by id
  getWorkflowById: (id: string) => {
    const workflow = workflows.find(w => w.id === id);
    if (!workflow) {
      return Promise.reject(new Error(`Workflow with id ${id} not found`));
    }
    return Promise.resolve({ ...workflow });
  },

  // Create new workflow
  createWorkflow: (workflow: Omit<Workflow, 'id' | 'createdAt' | 'status'>) => {
    const newWorkflow: Workflow = {
      ...workflow,
      id: uuid(),
      status: 'draft',
      createdAt: new Date().toISOString(),
      lastEditedAt: new Date().toISOString(),
    };
    workflows.push(newWorkflow);
    return Promise.resolve(newWorkflow);
  },

  // Update workflow
  updateWorkflow: (id: string, updates: Partial<Workflow>) => {
    const index = workflows.findIndex(w => w.id === id);
    if (index === -1) {
      return Promise.reject(new Error(`Workflow with id ${id} not found`));
    }
    
    const updatedWorkflow = {
      ...workflows[index],
      ...updates,
      lastEditedAt: new Date().toISOString(),
    };
    
    workflows[index] = updatedWorkflow;
    
    // If workflow status changed to 'completed', check if there's an associated alert to update
    if (updates.status === 'completed' && updatedWorkflow.metadata?.alertId) {
      checkWorkflowProgressForAlert(updatedWorkflow.metadata.alertId);
    }
    
    return Promise.resolve(updatedWorkflow);
  },

  // New methods for approval handling

  // Get all pending approvals for a user
  getPendingApprovalsForUser: (userId: string, userRoles: string[]) => {
    const pendingApprovals: ApprovalStep[] = [];
    
    // Loop through all active workflows
    workflows.filter(w => w.status === 'active').forEach(workflow => {
      // Find all approval steps
      workflow.steps.forEach(step => {
        if (step.type === 'approval') {
          const approvalStep = step as ApprovalStep;
          
          // Check if step is pending approval and user has appropriate role
          if (
            approvalStep.status === 'pending' &&
            approvalStep.approverRoles.some(role => userRoles.includes(role))
          ) {
            // Check if user has already approved
            const hasApproved = approvalStep.approvals?.some(a => a.approverId === userId);
            
            if (!hasApproved) {
              pendingApprovals.push({
                ...approvalStep,
                workflowId: workflow.id
              });
            }
          }
        }
      });
    });
    
    return Promise.resolve(pendingApprovals);
  },
  
  // Process an approval
  processApproval: (workflowId: string, stepId: string, userId: string, userName: string, userRole: string, action: 'approve' | 'reject', comments?: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (!workflow) {
      return Promise.reject(new Error(`Workflow with id ${workflowId} not found`));
    }
    
    // Find the approval step
    const stepIndex = workflow.steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1 || workflow.steps[stepIndex].type !== 'approval') {
      return Promise.reject(new Error(`Approval step with id ${stepId} not found`));
    }
    
    const approvalStep = workflow.steps[stepIndex] as ApprovalStep;
    
    // Create approval record
    const approvalRecord = {
      approverId: userId,
      approverName: userName,
      approverRole: userRole,
      status: action === 'approve' ? 'approved' as const : 'rejected' as const,
      timestamp: new Date().toISOString(),
      comments
    };
    
    // Add approval to step
    const updatedApprovals = [...(approvalStep.approvals || []), approvalRecord];
    
    // Update step status
    let stepStatus: 'pending' | 'approved' | 'rejected' = 'pending';
    if (action === 'reject') {
      stepStatus = 'rejected';
    } else {
      // Check if we have enough approvals
      const approvedCount = updatedApprovals.filter(a => a.status === 'approved').length;
      if (approvedCount >= approvalStep.requiredApprovals) {
        stepStatus = 'approved';
      }
    }
    
    // Update the workflow
    const updatedStep: ApprovalStep = {
      ...approvalStep,
      approvals: updatedApprovals,
      status: stepStatus
    };
    
    workflow.steps[stepIndex] = updatedStep;
    
    // If step is now approved or rejected, proceed with next steps
    if (stepStatus !== 'pending') {
      // In a real implementation, this would trigger the next steps in the workflow
      // based on approval or rejection path
      
      toast.success(`Approval "${approvalStep.name}" has been ${stepStatus}`);
      
      // For demo purposes, log what would happen next
      console.log(`Workflow step ${stepId} ${stepStatus}. ${stepStatus === 'approved' ? 'Approved' : 'Rejected'} path would be followed next.`);
    }
    
    return Promise.resolve(updatedStep);
  },

  // Delete workflow
  deleteWorkflow: (id: string) => {
    const index = workflows.findIndex(w => w.id === id);
    if (index === -1) {
      return Promise.reject(new Error(`Workflow with id ${id} not found`));
    }
    
    workflows.splice(index, 1);
    return Promise.resolve({ success: true });
  },

  // Create workflow from template
  createFromTemplate: (templateId: string, customizations?: Partial<Workflow>) => {
    const template = workflowTemplates.find(t => t.id === templateId);
    if (!template) {
      return Promise.reject(new Error(`Template with id ${templateId} not found`));
    }

    // Convert template to workflow
    const steps = generateStepsFromTemplate(templateId);
    
    const newWorkflow: Workflow = {
      id: uuid(),
      name: template.title,
      description: template.description,
      category: template.category,
      steps,
      status: 'active', // Auto-activate workflows created from templates
      createdAt: new Date().toISOString(),
      lastEditedAt: new Date().toISOString(),
      metadata: customizations?.metadata || {},
      ...customizations,
    };
    
    workflows.push(newWorkflow);
    return Promise.resolve(newWorkflow);
  },

  // Activate/deactivate workflow
  setWorkflowStatus: (id: string, status: 'active' | 'inactive' | 'draft' | 'completed') => {
    return workflowService.updateWorkflow(id, { status });
  },

  // Duplicate a workflow
  duplicateWorkflow: (id: string) => {
    const workflow = workflows.find(w => w.id === id);
    if (!workflow) {
      return Promise.reject(new Error(`Workflow with id ${id} not found`));
    }
    
    const newWorkflow: Workflow = {
      ...workflow,
      id: uuid(),
      name: `${workflow.name} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      lastEditedAt: new Date().toISOString(),
    };
    
    workflows.push(newWorkflow);
    return Promise.resolve(newWorkflow);
  },

  // Get all available templates
  getTemplates: () => {
    return Promise.resolve([...workflowTemplates]);
  },

  // Get a specific template
  getTemplateById: (id: string) => {
    const template = workflowTemplates.find(t => t.id === id);
    if (!template) {
      return Promise.reject(new Error(`Template with id ${id} not found`));
    }
    return Promise.resolve(template);
  },
  
  // Complete a workflow (for manual testing)
  completeWorkflow: (id: string) => {
    return workflowService.updateWorkflow(id, { status: 'completed' });
  }
};

// Helper to generate steps from a template
function generateStepsFromTemplate(templateId: string): WorkflowStep[] {
  // In a real app, this would generate actual steps based on the template
  // For now, return some simulated steps including approval steps
  
  let baseSteps: WorkflowStep[] = [
    {
      id: uuid(),
      type: 'trigger',
      triggerType: templateId.includes('email') ? 'time' : 'event',
      name: 'Start',
      config: {}
    }
  ];
  
  // Add specific steps based on template
  if (templateId === 'delinquency') {
    // Add approval step for collections
    baseSteps.push({
      id: uuid(),
      type: 'approval',
      approvalType: 'collection',
      name: 'Collection Advancement Approval',
      requiredApprovals: 1,
      approverRoles: ['board_member', 'manager'],
      config: {
        approvedSteps: [],
        rejectedSteps: []
      }
    });
  } else if (templateId === 'violation') {
    baseSteps.push({
      id: uuid(),
      type: 'approval',
      approvalType: 'violation',
      name: 'Violation Review',
      requiredApprovals: 1,
      approverRoles: ['committee_member', 'board_member'],
      config: {
        approvedSteps: [],
        rejectedSteps: []
      }
    });
  } else if (templateId === 'architecturalreview') {
    // ARC usually requires multiple approvals
    baseSteps.push({
      id: uuid(),
      type: 'approval',
      approvalType: 'arc',
      name: 'ARC Application Review',
      requiredApprovals: 2,
      approverRoles: ['committee_member'],
      config: {
        approvedSteps: [],
        rejectedSteps: []
      }
    });
  }
  
  // Add a notification action at the end
  baseSteps.push({
    id: uuid(),
    type: 'action',
    actionType: 'notification',
    name: 'Send Notification',
    config: { message: 'Workflow step completed' }
  });
  
  return baseSteps;
}

// Add letter template support to workflow actions
export const actionTypes = [
  { value: 'email', label: 'Send Email' },
  { value: 'notification', label: 'Send Notification' },
  { value: 'task', label: 'Create Task' },
  { value: 'letter', label: 'Generate Letter' },
  { value: 'update_status', label: 'Update Status' },
  { value: 'custom', label: 'Custom Action' },
];

// Initialize with some sample workflows
export function initializeWorkflows() {
  if (workflows.length === 0) {
    workflows = [
      {
        id: 'sample-1',
        name: 'Delinquency Process - Premium Properties',
        description: 'A specialized workflow for processing late fees for premium properties with specific rules',
        category: 'Financial',
        steps: [
          {
            id: '1',
            type: 'trigger',
            triggerType: 'time',
            name: 'Payment Due Date',
            config: { day: 1, repeat: 'monthly' }
          },
          {
            id: '2',
            type: 'condition',
            conditionType: 'equals',
            name: 'Check Payment Status',
            field: 'payment.status',
            value: 'unpaid',
            config: {
              trueSteps: [
                {
                  id: '3',
                  type: 'action',
                  actionType: 'email',
                  name: 'Send Payment Reminder',
                  config: { templateId: 'payment-reminder' }
                }
              ],
              falseSteps: []
            }
          },
          {
            id: '4',
            type: 'approval',
            approvalType: 'collection',
            name: 'Advance to Collections',
            requiredApprovals: 1,
            approverRoles: ['board_member', 'manager'],
            status: 'pending',
            approvals: [],
            config: {
              approvedSteps: [],
              rejectedSteps: []
            }
          }
        ],
        status: 'active',
        createdAt: '2023-05-10T14:30:00Z',
        lastEditedAt: '2023-05-10T14:30:00Z',
        createdBy: 'John Smith',
        metadata: {}
      },
      {
        id: 'sample-2',
        name: 'ARC Application Review',
        description: 'Architectural review committee application process with multi-level approvals',
        category: 'Compliance',
        steps: [
          {
            id: '1',
            type: 'trigger',
            triggerType: 'event',
            name: 'Application Submitted',
            config: { eventType: 'arc.application.submitted' }
          },
          {
            id: '2',
            type: 'approval',
            approvalType: 'arc',
            name: 'Initial ARC Committee Review',
            requiredApprovals: 2,
            approverRoles: ['committee_member'],
            status: 'pending',
            approvals: [],
            config: {
              dueDate: '2024-09-30T00:00:00Z',
              approvedSteps: [],
              rejectedSteps: []
            }
          },
          {
            id: '3',
            type: 'approval',
            approvalType: 'arc',
            name: 'Final Board Approval',
            requiredApprovals: 1,
            approverRoles: ['board_member'],
            status: 'pending',
            approvals: [],
            config: {
              approvedSteps: [],
              rejectedSteps: []
            }
          }
        ],
        status: 'active',
        createdAt: '2023-06-12T16:45:00Z',
        lastEditedAt: '2023-06-12T16:45:00Z',
        createdBy: 'Jane Smith',
        metadata: {}
      }
    ];
  }
}

// Initialize the sample data
initializeWorkflows();
