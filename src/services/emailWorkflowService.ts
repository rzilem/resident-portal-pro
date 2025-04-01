
import { toast } from 'sonner';

export interface OcrSettings {
  extractVendor?: boolean;
  extractDate?: boolean;
  extractAmount?: boolean;
  extractInvoiceNumber?: boolean;
  extractLineItems?: boolean;
  suggestGlAccount?: boolean;
  confidence?: 'low' | 'medium' | 'high';
}

export interface EmailWorkflowRule {
  id: string;
  name: string;
  inboundEmail: string;
  workflowType: string;
  forwardTo?: string;
  isActive: boolean;
  createdAt: string;
  description?: string;
  enableOcr?: boolean;
  ocrSettings?: OcrSettings;
  association?: string;
}

export const workflowTypes = [
  { value: 'General Inquiry', label: 'General Inquiry' },
  { value: 'Lead', label: 'Lead Management' },
  { value: 'Support', label: 'Support Ticket' },
  { value: 'Invoice', label: 'Invoice Processing' },
  { value: 'Maintenance Request', label: 'Maintenance Request' },
  { value: 'Accounting', label: 'Accounting' },
  { value: 'Compliance', label: 'Compliance' }
];

export const emailWorkflowService = {
  async getWorkflowRules(): Promise<EmailWorkflowRule[]> {
    // In a real application, this would fetch from your API
    // For now, we'll return mock data
    return [
      {
        id: '1',
        name: 'Lead Generation',
        inboundEmail: 'leads@example.com',
        workflowType: 'Lead',
        forwardTo: 'sales@example.com',
        isActive: true,
        createdAt: '2023-07-15T10:00:00Z',
        description: 'Process incoming emails as new leads'
      },
      {
        id: '2',
        name: 'Support Tickets',
        inboundEmail: 'support@example.com',
        workflowType: 'Support',
        forwardTo: 'helpdesk@example.com',
        isActive: true,
        createdAt: '2023-06-20T14:30:00Z',
        description: 'Create support tickets from emails'
      }
    ];
  },
  
  async createWorkflowRule(rule: Omit<EmailWorkflowRule, 'id' | 'createdAt'>): Promise<EmailWorkflowRule> {
    // Simulate API call
    const newRule: EmailWorkflowRule = {
      ...rule,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    
    toast.success('Workflow rule created');
    return newRule;
  },
  
  async updateWorkflowRule(id: string, updates: Partial<EmailWorkflowRule>): Promise<EmailWorkflowRule> {
    // Simulate API call
    const updatedRule: EmailWorkflowRule = {
      id,
      name: updates.name || 'Updated Rule',
      inboundEmail: updates.inboundEmail || 'updated@example.com',
      workflowType: updates.workflowType || 'Default',
      isActive: updates.isActive !== undefined ? updates.isActive : true,
      createdAt: '2023-01-01T00:00:00Z',
      forwardTo: updates.forwardTo,
      description: updates.description,
      enableOcr: updates.enableOcr,
      ocrSettings: updates.ocrSettings,
      association: updates.association
    };
    
    toast.success('Workflow rule updated');
    return updatedRule;
  },
  
  async deleteWorkflowRule(id: string): Promise<void> {
    // Simulate API call
    toast.success('Workflow rule deleted');
  },
  
  async toggleWorkflowRuleStatus(id: string, isActive: boolean): Promise<void> {
    // Simulate API call
    toast.success(`Workflow rule ${isActive ? 'activated' : 'deactivated'}`);
  }
};
