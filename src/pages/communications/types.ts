
export interface MessageTemplate {
  id: string;
  name: string;
  description?: string;
  subject: string;
  content: string;
  type: string;
  format: string;
  lastUpdated: string;
  isDefault?: boolean;
  tags?: string[];
  category?: string;
  createdAt?: string;
  updatedAt?: string;
  communities?: string[];
}

export interface Message {
  id: string;
  subject: string;
  content: string;
  recipientType: string;
  recipientCount: number;
  format: string;
  status: 'draft' | 'sent' | 'scheduled' | 'failed';
  sentAt?: string;
  scheduledFor?: string;
  openRate?: number;
  clickRate?: number;
  tags?: string[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  postedAt: string;
  expiresAt?: string;
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  viewCount: number;
  associationId?: string;
  tags?: string[];
}

export interface HtmlTemplate {
  id: string;
  name: string;
  description?: string;
  content: string;
  category: string;
  lastUpdated: string;
  createdBy: string;
  isGlobal: boolean;
  associationId?: string;
  tags?: string[];
}

export interface CompositionMessage {
  subject: string;
  content: string;
  recipients: string[];
}
