
// Email workflow service types and interfaces
import { supabase } from "@/integrations/supabase/client";

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
  { value: 'Lead Management', label: 'Lead Management' },
  { value: 'Custom', label: 'Custom Workflow' },
];

// Fetch email workflows from database
export const getEmailWorkflows = async (): Promise<EmailWorkflowRule[]> => {
  try {
    const { data, error } = await supabase
      .from('email_workflows')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;

    // Transform database column names to camelCase for frontend
    return data.map(workflow => ({
      id: workflow.id,
      name: workflow.name,
      inboundEmail: workflow.inbound_email,
      workflowType: workflow.workflow_type,
      forwardTo: workflow.forward_to,
      isActive: workflow.is_active,
      createdAt: workflow.created_at,
      description: workflow.description,
      association: workflow.association,
      forwardingEmail: workflow.forwarding_email,
      enableOcr: workflow.enable_ocr,
      ocrSettings: workflow.ocr_settings
    }));
  } catch (error) {
    console.error('Error fetching email workflows:', error);
    return [];
  }
};

// Create a new email workflow
export const createEmailWorkflow = async (params: CreateEmailWorkflowParams): Promise<EmailWorkflowRule> => {
  try {
    // Transform camelCase params to snake_case for database
    const { data, error } = await supabase
      .from('email_workflows')
      .insert({
        name: params.name,
        inbound_email: params.inboundEmail,
        workflow_type: params.workflowType,
        forward_to: params.forwardTo,
        is_active: params.isActive ?? true,
        description: params.description,
        association: params.association,
        forwarding_email: params.forwardingEmail,
        enable_ocr: params.enableOcr ?? false,
        ocr_settings: params.ocrSettings
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform back to camelCase for frontend
    return {
      id: data.id,
      name: data.name,
      inboundEmail: data.inbound_email,
      workflowType: data.workflow_type,
      forwardTo: data.forward_to,
      isActive: data.is_active,
      createdAt: data.created_at,
      description: data.description,
      association: data.association,
      forwardingEmail: data.forwarding_email,
      enableOcr: data.enable_ocr,
      ocrSettings: data.ocr_settings
    };
  } catch (error) {
    console.error('Error creating email workflow:', error);
    throw error;
  }
};

// Update an existing email workflow
export const updateEmailWorkflow = async (id: string, params: UpdateEmailWorkflowParams): Promise<EmailWorkflowRule> => {
  try {
    // Only include fields that are defined in the params to allow partial updates
    const updates: Record<string, any> = {};
    if (params.name !== undefined) updates.name = params.name;
    if (params.inboundEmail !== undefined) updates.inbound_email = params.inboundEmail;
    if (params.workflowType !== undefined) updates.workflow_type = params.workflowType;
    if (params.forwardTo !== undefined) updates.forward_to = params.forwardTo;
    if (params.isActive !== undefined) updates.is_active = params.isActive;
    if (params.description !== undefined) updates.description = params.description;
    if (params.association !== undefined) updates.association = params.association;
    if (params.forwardingEmail !== undefined) updates.forwarding_email = params.forwardingEmail;
    if (params.enableOcr !== undefined) updates.enable_ocr = params.enableOcr;
    if (params.ocrSettings !== undefined) updates.ocr_settings = params.ocrSettings;
    
    const { data, error } = await supabase
      .from('email_workflows')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      inboundEmail: data.inbound_email,
      workflowType: data.workflow_type,
      forwardTo: data.forward_to,
      isActive: data.is_active,
      createdAt: data.created_at,
      description: data.description,
      association: data.association,
      forwardingEmail: data.forwarding_email,
      enableOcr: data.enable_ocr,
      ocrSettings: data.ocr_settings
    };
  } catch (error) {
    console.error('Error updating email workflow:', error);
    throw error;
  }
};

// Delete an email workflow
export const deleteEmailWorkflow = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('email_workflows')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting email workflow:', error);
    throw error;
  }
};

// Process lead emails and create lead records with extended information
export const processLeadEmail = async (emailContent: { 
  from: string; 
  subject: string; 
  body: string;
  attachments?: Array<{
    filename: string;
    content: string; // base64 encoded
    contentType: string;
  }>;
}) => {
  try {
    // Extract potential lead information from email
    const email = emailContent.from;
    const emailParts = email.split('@');
    const name = emailParts[0].includes('.') 
      ? emailParts[0].split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
      : emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1);
    
    // Find relevant workflow
    const { data: workflows } = await supabase
      .from('email_workflows')
      .select('*')
      .eq('workflow_type', 'Lead Management')
      .eq('inbound_email', 'lead@hoamanagersoftware.com')
      .limit(1);
    
    const workflow = workflows && workflows.length > 0 ? workflows[0] : null;
    const useOcr = workflow?.enable_ocr || false;
    
    // Parse the email body for additional information using OCR if enabled
    let extractedData: Record<string, any> = {};
    
    if (useOcr && emailContent.attachments && emailContent.attachments.length > 0) {
      // In a real implementation, we would send the attachment to an OCR service
      // For demonstration, we'll simulate OCR extraction
      extractedData = await simulateOcrExtraction(emailContent.attachments[0].content);
      console.log('OCR extracted data:', extractedData);
    }
    
    // Combine OCR data with regular email parsing
    const associationName = extractedData.associationName || extractFromEmail(emailContent.body, 'association', 'community');
    const associationType = extractedData.associationType || extractFromEmail(emailContent.body, 'type', 'hoa', 'condo', 'community');
    const currentManagement = extractedData.currentManagement || extractFromEmail(emailContent.body, 'management', 'manager');
    const unitCountMatch = extractedData.unitCount || emailContent.body.match(/(\d+)\s*(units|homes|properties)/i);
    const unitCount = extractedData.unitCount || (unitCountMatch ? parseInt(unitCountMatch[1]) : null);
    const address = extractedData.address || extractFromEmail(emailContent.body, 'address', 'location', 'located');
    const city = extractedData.city || extractFromEmail(emailContent.body, 'city', 'town');
    const state = extractedData.state || extractFromEmail(emailContent.body, 'state');
    
    // Extract boolean information
    const hasPool = extractedData.hasPool !== undefined ? extractedData.hasPool : checkForKeywords(emailContent.body, 'pool', 'swimming');
    const hasGate = extractedData.hasGate !== undefined ? extractedData.hasGate : checkForKeywords(emailContent.body, 'gate', 'gated', 'secured');
    const hasOnsite = extractedData.hasOnsite !== undefined ? extractedData.hasOnsite : checkForKeywords(emailContent.body, 'onsite', 'on-site', 'on site', 'manager');
    
    // Handle attachments if any
    const uploadedFiles = emailContent.attachments ? 
      emailContent.attachments.map(attachment => ({
        filename: attachment.filename,
        contentType: attachment.contentType,
        size: calculateBase64Size(attachment.content)
      })) : [];
    
    // Create a new lead in the leads table with all available information
    const { data, error } = await supabase.from('leads').insert([
      {
        name: name,
        email: email,
        status: 'new',
        source: 'Email Workflow',
        notes: `Subject: ${emailContent.subject}\n\nBody: ${emailContent.body}`,
        created_at: new Date().toISOString(),
        // Additional fields
        association_name: associationName,
        association_type: associationType,
        current_management: currentManagement,
        unit_count: unitCount,
        address: address,
        city: city,
        state: state,
        has_pool: hasPool,
        has_gate: hasGate,
        has_onsite_management: hasOnsite,
        uploaded_files: uploadedFiles.length > 0 ? uploadedFiles : null
      }
    ]).select();
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error processing lead email:', error);
    return { success: false, error };
  }
};

// Simulate OCR extraction (in a real implementation, this would call an OCR service)
async function simulateOcrExtraction(base64Content: string): Promise<Record<string, any>> {
  try {
    // In a real implementation, we would send the base64 content to an OCR service
    // For demonstration, we'll return simulated extracted data
    console.log('Simulating OCR extraction from document...');
    
    // In a real scenario, the following would be determined by OCR analysis
    return {
      associationName: null, // Would be extracted from document
      associationType: null,
      unitCount: null,
      address: null,
      city: null,
      state: null,
      hasPool: null,
      hasGate: null,
      hasOnsite: null
    };
  } catch (error) {
    console.error('Error in OCR extraction:', error);
    return {};
  }
}

// Helper function to extract information from email body
function extractFromEmail(body: string, ...keywords: string[]): string | null {
  const lowerBody = body.toLowerCase();
  
  for (const keyword of keywords) {
    // Look for patterns like "association: name" or "association is name"
    const patterns = [
      new RegExp(`${keyword}\\s*:\\s*([^\\n.,]+)`, 'i'),
      new RegExp(`${keyword}\\s+is\\s+([^\\n.,]+)`, 'i'),
      new RegExp(`${keyword}\\s+of\\s+([^\\n.,]+)`, 'i'),
      new RegExp(`our\\s+${keyword}\\s+is\\s+([^\\n.,]+)`, 'i'),
      new RegExp(`the\\s+${keyword}\\s+is\\s+([^\\n.,]+)`, 'i')
    ];
    
    for (const pattern of patterns) {
      const match = body.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    // Look for the keyword and try to extract what follows
    const keywordIndex = lowerBody.indexOf(keyword.toLowerCase());
    if (keywordIndex !== -1) {
      // Extract up to 50 characters after the keyword
      const afterKeyword = body.slice(keywordIndex + keyword.length, keywordIndex + keyword.length + 50);
      // Look for the first sentence or reasonable chunk of text
      const endOfInfoIndex = afterKeyword.search(/[.,:;!?]|\n/);
      if (endOfInfoIndex !== -1 && endOfInfoIndex > 2) {
        return afterKeyword.slice(0, endOfInfoIndex).trim();
      }
    }
  }
  
  return null;
}

// Helper function to check if any keywords are present
function checkForKeywords(body: string, ...keywords: string[]): boolean {
  const lowerBody = body.toLowerCase();
  return keywords.some(keyword => {
    return lowerBody.includes(keyword.toLowerCase());
  });
}

// Helper function to calculate size of base64 encoded content
function calculateBase64Size(base64String: string): number {
  // Remove data URL prefix if present
  const base64 = base64String.replace(/^data:.+;base64,/, '');
  return Math.round((base64.length * 3) / 4);
}
