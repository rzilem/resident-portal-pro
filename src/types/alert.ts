
export type AlertType = 'financial' | 'operational' | 'compliance' | 'governance' | 'maintenance' | 'security' | 'engagement';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'new' | 'in-progress' | 'resolved' | 'dismissed';
export type AlertScope = 'global' | 'association';
export type AlertSource = 'system' | 'analytics' | 'manual';
export type AlertCategory = 'financial' | 'security' | 'compliance' | 'maintenance' | 'engagement';

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  createdAt: string;
  scope: AlertScope;
  source: AlertSource;
  category: AlertCategory;
  associationId: string | null;
  isRecent?: boolean;
  relatedWorkflowId?: string;
  solutions: AlertSolution[];
}

export interface AlertSolution {
  id: string;
  title: string;
  description: string;
  actionType: 'workflow' | 'notification' | 'manual';
  workflowTemplateId?: string;
  steps?: string[];
  action?: () => Promise<void>;
}
