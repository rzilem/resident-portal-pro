
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertCategory = 'financial' | 'maintenance' | 'security' | 'compliance' | 'engagement' | 'other';
export type AlertStatus = 'new' | 'in-progress' | 'resolved' | 'dismissed';

export interface Alert {
  id: string;
  title: string;
  description: string;
  category: AlertCategory;
  severity: AlertSeverity;
  status: AlertStatus;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  propertyId?: string;
  associationId?: string;
  assignedTo?: string;
  source?: string;
  actions?: AlertAction[];
  
  // Adding missing properties used in mockAlerts.ts
  scope?: 'global' | 'association' | 'property';
  isRecent?: boolean;
  solutions?: AlertSolution[];
}

export interface AlertAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'destructive';
  handler: () => void;
}

export interface AlertSolution {
  id: string;
  title: string;
  description: string;
  steps: string[];
  alertType?: string;
  actionType?: 'workflow' | 'manual';
  workflowTemplateId?: string;
  action?: () => Promise<void>;
}
