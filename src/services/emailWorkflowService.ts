
import { v4 as uuid } from 'uuid';

export interface EmailWorkflowRule {
  id: string;
  inboundEmail: string;
  workflowType: string;
  association?: string;
  forwardingEmail: string;
  isActive: boolean;
  createdAt: string;
  lastModified?: string;
}

// Possible workflow types for email rules
export const workflowTypes = [
  'General Inquiry',
  'Maintenance Request',
  'Violation Report',
  'Payment Confirmation',
  'Document Submission',
  'Board Communication',
  'Committee Request',
  'Event Registration',
  'Architectural Review',
  'Custom Workflow'
];

// Mock database for email rules
let emailWorkflowRules: EmailWorkflowRule[] = [
  {
    id: '1',
    inboundEmail: 'maintenance@oakridgecommunity.com',
    workflowType: 'Maintenance Request',
    association: 'Oakridge Community',
    forwardingEmail: 'service@repairteam.com',
    isActive: true,
    createdAt: '2023-06-15T10:00:00Z'
  },
  {
    id: '2',
    inboundEmail: 'violations@pinetreehoa.org',
    workflowType: 'Violation Report',
    association: 'Pine Tree HOA',
    forwardingEmail: 'compliance@pinetreehoa.org',
    isActive: true,
    createdAt: '2023-07-22T14:30:00Z'
  },
  {
    id: '3',
    inboundEmail: 'documents@lakesidecondos.net',
    workflowType: 'Document Submission',
    association: 'Lakeside Condominiums',
    forwardingEmail: 'records@propertymgmt.com',
    isActive: false,
    createdAt: '2023-08-05T09:15:00Z',
    lastModified: '2023-09-10T11:20:00Z'
  }
];

export const emailWorkflowService = {
  // Get all email workflow rules
  getAllRules: () => {
    return Promise.resolve([...emailWorkflowRules]);
  },
  
  // Get rule by ID
  getRuleById: (id: string) => {
    const rule = emailWorkflowRules.find(r => r.id === id);
    if (!rule) {
      return Promise.reject(new Error(`Rule with ID ${id} not found`));
    }
    return Promise.resolve({...rule});
  },
  
  // Create new rule
  createRule: (rule: Omit<EmailWorkflowRule, 'id' | 'createdAt'>) => {
    const newRule: EmailWorkflowRule = {
      ...rule,
      id: uuid(),
      createdAt: new Date().toISOString()
    };
    
    emailWorkflowRules.push(newRule);
    return Promise.resolve(newRule);
  },
  
  // Update rule
  updateRule: (id: string, updates: Partial<Omit<EmailWorkflowRule, 'id' | 'createdAt'>>) => {
    const index = emailWorkflowRules.findIndex(r => r.id === id);
    if (index === -1) {
      return Promise.reject(new Error(`Rule with ID ${id} not found`));
    }
    
    const updatedRule = {
      ...emailWorkflowRules[index],
      ...updates,
      lastModified: new Date().toISOString()
    };
    
    emailWorkflowRules[index] = updatedRule;
    return Promise.resolve(updatedRule);
  },
  
  // Delete rule
  deleteRule: (id: string) => {
    const index = emailWorkflowRules.findIndex(r => r.id === id);
    if (index === -1) {
      return Promise.reject(new Error(`Rule with ID ${id} not found`));
    }
    
    emailWorkflowRules.splice(index, 1);
    return Promise.resolve({ success: true });
  },
  
  // Toggle rule status (active/inactive)
  toggleRuleStatus: (id: string) => {
    const index = emailWorkflowRules.findIndex(r => r.id === id);
    if (index === -1) {
      return Promise.reject(new Error(`Rule with ID ${id} not found`));
    }
    
    const updatedRule = {
      ...emailWorkflowRules[index],
      isActive: !emailWorkflowRules[index].isActive,
      lastModified: new Date().toISOString()
    };
    
    emailWorkflowRules[index] = updatedRule;
    return Promise.resolve(updatedRule);
  },
  
  // Process an incoming email
  processIncomingEmail: (email: {
    from: string;
    to: string;
    subject: string;
    body: string;
    attachments?: any[];
  }) => {
    // Find matching rule
    const rule = emailWorkflowRules.find(
      r => r.isActive && r.inboundEmail.toLowerCase() === email.to.toLowerCase()
    );
    
    if (!rule) {
      return Promise.resolve({
        processed: false,
        message: 'No active rule found for this email address'
      });
    }
    
    // In a real implementation, this would:
    // 1. Forward the email to the forwarding address
    // 2. Trigger the appropriate workflow
    // 3. Process any attachments
    
    console.log(`Email processed: ${email.subject}`);
    console.log(`Workflow type: ${rule.workflowType}`);
    console.log(`Forwarded to: ${rule.forwardingEmail}`);
    
    return Promise.resolve({
      processed: true,
      rule,
      message: `Email processed and forwarded to ${rule.forwardingEmail}`
    });
  }
};
