
export interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  status: LeadStatus;
  source?: string;
  proposalIds?: string[];
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  lastContactedAt?: string;
  assignedTo?: string;
  tags?: string[];
}

export type LeadStatus = 
  | 'new' 
  | 'contacted' 
  | 'qualified' 
  | 'proposal' 
  | 'negotiation' 
  | 'closed-won' 
  | 'closed-lost';

export interface Proposal {
  id: string;
  name: string;
  description?: string;
  sections: ProposalSection[];
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  viewCount?: number;
  lastViewedAt?: string;
}

export interface ProposalSection {
  id: string;
  title: string;
  type: 'document' | 'image' | 'video' | 'pdf';
  content: string;
  description?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface EmailSequence {
  id: string;
  name: string;
  description?: string;
  steps: EmailSequenceStep[];
  active: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface EmailSequenceStep {
  id: string;
  templateId: string;
  delay: number;
  delayUnit: 'minutes' | 'hours' | 'days' | 'weeks';
  condition?: string;
}
