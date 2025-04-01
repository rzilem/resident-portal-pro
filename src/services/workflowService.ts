
import { Workflow, WorkflowStep, ApprovalStep } from '@/types/workflow';
import { v4 as uuid } from 'uuid';
import { workflowTemplates } from '@/data/workflowTemplates';

// Sample mock data for workflows
const mockWorkflows: Workflow[] = [
  {
    id: uuid(),
    name: 'New Resident Onboarding',
    description: 'Automatic workflow for onboarding new residents',
    category: 'residents',
    status: 'active',
    createdAt: new Date().toISOString(),
    steps: [
      {
        id: uuid(),
        name: 'Send Welcome Email',
        type: 'action',
        actionType: 'email',
        config: {
          templateId: 'welcome-email',
          recipients: 'new-resident'
        }
      },
      {
        id: uuid(),
        name: 'Create Resident Profile',
        type: 'action',
        actionType: 'task',
        config: {
          title: 'Create resident profile',
          assignedTo: 'manager'
        }
      }
    ]
  },
  {
    id: uuid(),
    name: 'Invoice Approval',
    description: 'Process for approving vendor invoices',
    category: 'financial',
    status: 'active',
    createdAt: new Date().toISOString(),
    steps: [
      {
        id: uuid(),
        name: 'Review Invoice',
        type: 'approval',
        approvalType: 'invoice',
        requiredApprovals: 1,
        approverRoles: ['board_member', 'manager'],
        config: {
          approvedSteps: [],
          rejectedSteps: []
        }
      },
      {
        id: uuid(),
        name: 'Process Payment',
        type: 'action',
        actionType: 'task',
        config: {
          title: 'Process invoice payment',
          assignedTo: 'accounting'
        }
      }
    ]
  }
];

// Mock implementation for workflow service
export const workflowService = {
  /**
   * Get all workflows
   */
  getAllWorkflows: async (): Promise<Workflow[]> => {
    // In a real application, this would fetch from an API or database
    return Promise.resolve([...mockWorkflows]);
  },

  /**
   * Get a specific workflow by ID
   */
  getWorkflowById: async (id: string): Promise<Workflow | null> => {
    const workflow = mockWorkflows.find(w => w.id === id);
    return Promise.resolve(workflow || null);
  },

  /**
   * Create a new workflow
   */
  createWorkflow: async (workflow: Omit<Workflow, 'id' | 'createdAt' | 'status'>): Promise<Workflow> => {
    const newWorkflow: Workflow = {
      ...workflow,
      id: uuid(),
      createdAt: new Date().toISOString(),
      status: 'draft'
    };
    
    mockWorkflows.push(newWorkflow);
    return Promise.resolve(newWorkflow);
  },

  /**
   * Create a workflow from a template
   */
  createFromTemplate: async (templateId: string): Promise<Workflow> => {
    const template = workflowTemplates.find(t => t.id === templateId);
    
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }
    
    const newWorkflow: Workflow = {
      id: uuid(),
      name: template.title,
      description: template.description,
      category: template.category,
      status: 'draft',
      createdAt: new Date().toISOString(),
      steps: [],
      supportedMergeTags: template.supportedMergeTags
    };
    
    mockWorkflows.push(newWorkflow);
    return Promise.resolve(newWorkflow);
  },

  /**
   * Update an existing workflow
   */
  updateWorkflow: async (id: string, updates: Partial<Workflow>): Promise<Workflow> => {
    const index = mockWorkflows.findIndex(w => w.id === id);
    
    if (index === -1) {
      throw new Error(`Workflow with ID ${id} not found`);
    }
    
    const updatedWorkflow = {
      ...mockWorkflows[index],
      ...updates,
      lastEditedAt: new Date().toISOString()
    };
    
    mockWorkflows[index] = updatedWorkflow;
    return Promise.resolve(updatedWorkflow);
  },

  /**
   * Delete a workflow
   */
  deleteWorkflow: async (id: string): Promise<void> => {
    const index = mockWorkflows.findIndex(w => w.id === id);
    
    if (index === -1) {
      throw new Error(`Workflow with ID ${id} not found`);
    }
    
    mockWorkflows.splice(index, 1);
    return Promise.resolve();
  },

  /**
   * Duplicate a workflow
   */
  duplicateWorkflow: async (id: string): Promise<Workflow> => {
    const workflow = mockWorkflows.find(w => w.id === id);
    
    if (!workflow) {
      throw new Error(`Workflow with ID ${id} not found`);
    }
    
    const newWorkflow: Workflow = {
      ...workflow,
      id: uuid(),
      name: `${workflow.name} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      lastEditedAt: undefined
    };
    
    mockWorkflows.push(newWorkflow);
    return Promise.resolve(newWorkflow);
  }
};
