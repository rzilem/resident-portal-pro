
// Email workflow service types and interfaces

export interface EmailWorkflowRule {
  id: string;
  name: string;
  inboundEmail: string;
  workflowType: string;
  forwardTo: string;
  isActive: boolean;
  createdAt: string;
  description?: string;
  association?: string;
  forwardingEmail?: string;
  enableOcr?: boolean;
  ocrSettings?: OcrSettings;
}

export interface OcrSettings {
  extractVendor: boolean;
  extractDate: boolean;
  extractAmount: boolean;
  extractInvoiceNumber: boolean;
  extractLineItems: boolean;
  suggestGlAccount: boolean;
  confidence: 'high' | 'medium' | 'low';
}

export interface CreateEmailWorkflowParams {
  name: string;
  inboundEmail: string;
  workflowType: string;
  forwardTo: string;
  isActive?: boolean;
  description?: string;
  association?: string;
  forwardingEmail?: string;
  enableOcr?: boolean;
  ocrSettings?: OcrSettings;
}

export interface UpdateEmailWorkflowParams {
  name?: string;
  inboundEmail?: string;
  workflowType?: string;
  forwardTo?: string;
  isActive?: boolean;
  description?: string;
  association?: string;
  forwardingEmail?: string;
  enableOcr?: boolean;
  ocrSettings?: Partial<OcrSettings>;
}

// Available workflow types
export const workflowTypes = [
  { value: 'Maintenance Request', label: 'Maintenance Request' },
  { value: 'Accounting', label: 'Accounting' },
  { value: 'Invoice', label: 'Invoice Processing' },
  { value: 'Compliance', label: 'Compliance' },
  { value: 'ARC', label: 'Architectural Review' },
  { value: 'General', label: 'General Inquiry' },
  { value: 'Document', label: 'Document Processing' },
  { value: 'Calendar', label: 'Calendar Event' },
  { value: 'Custom', label: 'Custom Workflow' },
];

// Mock API service functions for future implementation
export const getEmailWorkflows = async (): Promise<EmailWorkflowRule[]> => {
  // In a real application, this would be an API call
  // For now, return an empty array
  return [];
};

export const createEmailWorkflow = async (params: CreateEmailWorkflowParams): Promise<EmailWorkflowRule> => {
  // In a real application, this would be an API call
  // For now, throw an error to indicate this is not implemented
  throw new Error('API not implemented');
};

export const updateEmailWorkflow = async (id: string, params: UpdateEmailWorkflowParams): Promise<EmailWorkflowRule> => {
  // In a real application, this would be an API call
  // For now, throw an error to indicate this is not implemented
  throw new Error('API not implemented');
};

export const deleteEmailWorkflow = async (id: string): Promise<void> => {
  // In a real application, this would be an API call
  // For now, throw an error to indicate this is not implemented
  throw new Error('API not implemented');
};
