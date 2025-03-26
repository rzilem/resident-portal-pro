
export type AlertType = 'financial' | 'operational' | 'compliance' | 'governance' | 'maintenance';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'new' | 'in-progress' | 'resolved' | 'dismissed';

export interface Alert {
  id: string;
  title: string;
  description: string;
  type: AlertType;
  severity: AlertSeverity;
  associationId?: string;
  timestamp: string;
  status: AlertStatus;
  solutions: AlertSolution[];
  relatedWorkflowId?: string;
}

export interface AlertSolution {
  id: string;
  title: string;
  description: string;
  actionType: 'workflow' | 'notification' | 'manual';
  workflowTemplateId?: string;
  action: () => Promise<void>;
}
