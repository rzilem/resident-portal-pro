
interface EmailWorkflowRule {
  id: string;
  inboundEmail: string;
  workflowType: string;
  association?: string;
  forwardingEmail: string;
  isActive: boolean;
  createdAt: string;
  lastModified?: string;
}

// Mock data storage for email workflow rules
let emailWorkflowRules: EmailWorkflowRule[] = [
  {
    id: '1',
    inboundEmail: 'info@psprop.net',
    workflowType: 'General Inquiry',
    association: '',
    forwardingEmail: 'pspm-2@messages.vantaca.com',
    isActive: true,
    createdAt: '2023-05-10T14:30:00Z'
  },
  {
    id: '2',
    inboundEmail: 'payments@psprop.net',
    workflowType: 'Billing Question',
    association: '',
    forwardingEmail: 'pspm-3@messages.vantaca.com',
    isActive: true,
    createdAt: '2023-05-10T14:30:00Z'
  },
  {
    id: '3',
    inboundEmail: 'avalon@psprop.net',
    workflowType: 'General Inquiry',
    association: 'Avalon Master Community, Inc',
    forwardingEmail: 'pspm-5@messages.vantaca.com',
    isActive: true,
    createdAt: '2023-05-10T14:30:00Z'
  },
  {
    id: '4',
    inboundEmail: 'thewoodshoa@psprop.net',
    workflowType: 'General Inquiry',
    association: 'The Woods Association of Owners, Inc.',
    forwardingEmail: 'pspm-8@messages.vantaca.com',
    isActive: true,
    createdAt: '2023-05-10T14:30:00Z'
  },
  {
    id: '5',
    inboundEmail: 'violations@psprop.net',
    workflowType: 'General Inquiry',
    association: '',
    forwardingEmail: 'pspm-10@messages.vantaca.com',
    isActive: true,
    createdAt: '2023-05-10T14:30:00Z'
  },
  {
    id: '6',
    inboundEmail: 'communitymanager@hillspoa.com',
    workflowType: 'Hills General Inquiry',
    association: 'Hills of Lakeway Property Owners Association Inc',
    forwardingEmail: 'pspm-11@messages.vantaca.com',
    isActive: true,
    createdAt: '2023-06-12T10:15:00Z'
  },
  {
    id: '7',
    inboundEmail: 'siena@psprop.net',
    workflowType: 'General Inquiry',
    association: 'Siena Master Community, Inc',
    forwardingEmail: 'pspm-12@messages.vantaca.com',
    isActive: true,
    createdAt: '2023-06-15T09:30:00Z'
  },
  {
    id: '8',
    inboundEmail: 'architecture@hillspoa.com',
    workflowType: 'Hills ARC Request',
    association: 'Hills of Lakeway Property Owners Association Inc',
    forwardingEmail: 'pspm-13@messages.vantaca.com',
    isActive: true,
    createdAt: '2023-06-18T14:20:00Z'
  },
  {
    id: '9',
    inboundEmail: 'thehills@psprop.net',
    workflowType: 'General Inquiry',
    association: 'Hills of Lakeway Property Owners Association Inc',
    forwardingEmail: 'pspm-14@messages.vantaca.com',
    isActive: true,
    createdAt: '2023-06-20T11:45:00Z'
  },
  {
    id: '10',
    inboundEmail: 'invoices@psprop.net',
    workflowType: 'Invoice',
    association: '',
    forwardingEmail: 'pspm-15@messages.vantaca.com',
    isActive: true,
    createdAt: '2023-06-22T16:30:00Z'
  },
  {
    id: '11',
    inboundEmail: 'compliance@psprop.net',
    workflowType: 'Violation Inquiry',
    association: '',
    forwardingEmail: 'pspm-16@messages.vantaca.com',
    isActive: true,
    createdAt: '2023-06-25T13:10:00Z'
  }
];

// Predefined workflow types
export const workflowTypes = [
  'General Inquiry',
  'Billing Question',
  'Invoice',
  'Hills General Inquiry',
  'Hills ARC Request',
  'Violation Inquiry',
  'Maintenance Request',
  'Board Communication',
  'Other'
];

export const emailWorkflowService = {
  /**
   * Get all email workflow rules
   */
  getAllWorkflowRules: () => {
    return [...emailWorkflowRules];
  },

  /**
   * Get a specific email workflow rule by ID
   */
  getWorkflowRuleById: (id: string) => {
    const rule = emailWorkflowRules.find(rule => rule.id === id);
    if (!rule) {
      throw new Error(`Email workflow rule with ID ${id} not found`);
    }
    return { ...rule };
  },

  /**
   * Create a new email workflow rule
   */
  createWorkflowRule: (rule: Omit<EmailWorkflowRule, 'id' | 'createdAt'>) => {
    const newRule: EmailWorkflowRule = {
      ...rule,
      id: (emailWorkflowRules.length + 1).toString(),
      isActive: rule.isActive ?? true,
      createdAt: new Date().toISOString()
    };

    emailWorkflowRules.push(newRule);
    return { ...newRule };
  },

  /**
   * Update an existing email workflow rule
   */
  updateWorkflowRule: (id: string, updates: Partial<EmailWorkflowRule>) => {
    const index = emailWorkflowRules.findIndex(rule => rule.id === id);
    if (index === -1) {
      throw new Error(`Email workflow rule with ID ${id} not found`);
    }

    emailWorkflowRules[index] = {
      ...emailWorkflowRules[index],
      ...updates,
      lastModified: new Date().toISOString()
    };

    return { ...emailWorkflowRules[index] };
  },

  /**
   * Delete an email workflow rule
   */
  deleteWorkflowRule: (id: string) => {
    const index = emailWorkflowRules.findIndex(rule => rule.id === id);
    if (index === -1) {
      throw new Error(`Email workflow rule with ID ${id} not found`);
    }

    emailWorkflowRules.splice(index, 1);
    return true;
  },

  /**
   * Toggle the active status of a workflow rule
   */
  toggleWorkflowRuleStatus: (id: string) => {
    const index = emailWorkflowRules.findIndex(rule => rule.id === id);
    if (index === -1) {
      throw new Error(`Email workflow rule with ID ${id} not found`);
    }

    emailWorkflowRules[index].isActive = !emailWorkflowRules[index].isActive;
    emailWorkflowRules[index].lastModified = new Date().toISOString();
    
    return { ...emailWorkflowRules[index] };
  }
};

export type { EmailWorkflowRule };
