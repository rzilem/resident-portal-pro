
import { Workflow, WorkflowStep, WorkflowTemplate } from '@/types/workflow';
import { v4 as uuid } from 'uuid';
import { checkWorkflowProgressForAlert } from '@/utils/alertUtils';

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
  // For now, return some simulated steps
  
  const baseSteps: WorkflowStep[] = [
    {
      id: uuid(),
      type: 'trigger',
      triggerType: templateId.includes('email') ? 'time' : 'event',
      name: 'Start',
      config: {}
    },
    {
      id: uuid(),
      type: 'action',
      actionType: 'notification',
      name: 'Send Notification',
      config: {
        message: 'Workflow step completed'
      }
    }
  ];
  
  if (templateId === 'delinquency' || templateId === 'violation') {
    baseSteps.push({
      id: uuid(),
      type: 'condition',
      conditionType: 'equals',
      name: 'Check Status',
      field: 'status',
      value: 'pending',
      config: {
        trueSteps: [],
        falseSteps: []
      }
    });
  }
  
  return baseSteps;
}

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
        name: 'Community Event Reminders',
        description: 'Customized sequence of reminders for community events with attendance confirmation',
        category: 'Communication',
        steps: [
          {
            id: '1',
            type: 'trigger',
            triggerType: 'event',
            name: 'Event Created',
            config: { eventType: 'community.event.created' }
          },
          {
            id: '2',
            type: 'action',
            actionType: 'email',
            name: 'Send Initial Announcement',
            config: { templateId: 'event-announcement' }
          }
        ],
        status: 'active',
        createdAt: '2023-06-12T16:45:00Z',
        lastEditedAt: '2023-06-12T16:45:00Z',
        createdBy: 'John Smith',
        metadata: {}
      }
    ];
  }
}

// Initialize the sample data
initializeWorkflows();
