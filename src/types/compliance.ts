
import { Tag } from './resident';

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

export interface ViolationTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  severity: 'low' | 'medium' | 'high';
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  defaultComplianceDays?: number;
  defaultFine?: number;
  lastUsed?: string;
  usageCount?: number;
  relatedType?: string;
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
