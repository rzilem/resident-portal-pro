
import { v4 as uuid } from 'uuid';
import { toast } from 'sonner';
import { Alert, AlertStatus, AlertType, AlertSeverity } from '@/types/alert';
import { alertsDatabase } from '@/data/mockAlerts';

// Utility functions for querying alerts
export const getAlerts = (filters?: {
  type?: AlertType,
  severity?: AlertSeverity,
  status?: AlertStatus,
  associationId?: string
}): Alert[] => {
  let filteredAlerts = [...alertsDatabase];
  
  if (filters) {
    if (filters.type) {
      filteredAlerts = filteredAlerts.filter(alert => alert.type === filters.type);
    }
    
    if (filters.severity) {
      filteredAlerts = filteredAlerts.filter(alert => alert.severity === filters.severity);
    }
    
    if (filters.status) {
      filteredAlerts = filteredAlerts.filter(alert => alert.status === filters.status);
    }
    
    if (filters.associationId) {
      filteredAlerts = filteredAlerts.filter(alert => 
        !alert.associationId || alert.associationId === filters.associationId
      );
    }
  }
  
  // Sort by severity and then by timestamp (newest first)
  return filteredAlerts.sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
};

export const getAlertById = (id: string): Alert | undefined => {
  return alertsDatabase.find(alert => alert.id === id);
};
