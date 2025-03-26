
import { Tag } from './resident';
import type { Database } from '@/integrations/supabase/types';

// Extend Supabase types with our violations table
export type ViolationRow = {
  id: string;
  association_id: string;
  property_id: string;
  violation_type: string;
  reported_date: string;
  description?: string;
  status: string;
  resolved_date?: string;
  created_at: string;
  updated_at: string;
  properties?: {
    address: string;
  };
};

export interface ViolationType {
  id: string;
  name: string;
  category: string;
  defaultFine?: number;
  description?: string;
  tag?: Tag;
}

export interface ViolationStatus {
  id: string;
  name: string;
  color: string;
  isDefault?: boolean;
  isResolved?: boolean;
  isCancelled?: boolean;
}

export interface ViolationTemplateFilter {
  item?: string;
  group?: string;
  description?: string;
  showUnused?: boolean;
}

export interface ViolationGroup {
  id: string;
  name: string;
  associationId: string;
}

export interface ViolationTemplate {
  id: string;
  title?: string;
  category?: string;
  description: string;
  content?: string;
  severity?: 'low' | 'medium' | 'high';
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  defaultComplianceDays?: number;
  defaultFine?: number;
  lastUsed?: string;
  usageCount?: number;
  relatedType?: string;
  // Additional fields needed for violation templates
  group: string;
  item: string;
  articleNumber?: string;
  associationId: string;
  isUsed: boolean;
}

export interface Violation {
  id: string;
  propertyId: string | number;
  unitId?: string | number;
  residentId?: string | number;
  reported: {
    date: string;
    by: string;
    method: 'email' | 'phone' | 'in-person' | 'inspection' | 'other';
  };
  violation: {
    type: string;
    description: string;
    evidence?: string[];
    location?: string;
    severity: 'low' | 'medium' | 'high';
  };
  status: {
    current: string;
    history: {
      date: string;
      status: string;
      comment?: string;
      by: string;
    }[];
  };
  compliance: {
    dueDate: string;
    hearingDate?: string;
    hearingScheduled?: boolean;
    resolved?: {
      date: string;
      by: string;
      notes?: string;
    };
  };
  communications: {
    date: string;
    type: string;
    sent: boolean;
    deliveryStatus?: string;
    template?: string;
  }[];
  fines: {
    amount: number;
    date: string;
    status: 'pending' | 'paid' | 'waived' | 'appealed';
    paidDate?: string;
    invoiceId?: string;
  }[];
  notes: {
    date: string;
    content: string;
    author: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceStats {
  total: number;
  open: number;
  closed: number;
  hearing: number;
  byCategory: {
    category: string;
    count: number;
  }[];
  byStatus: {
    status: string;
    count: number;
  }[];
  byMonth: {
    month: string;
    reported: number;
    resolved: number;
  }[];
}
