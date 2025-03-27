import { Alert } from '@/types/alert';
import { mockAlerts } from '@/data/mockAlerts';

// Function to get all alerts
export const getAllAlerts = (): Alert[] => {
  return mockAlerts;
};

// Function to get recent alerts, optionally filtered by association ID
export const getRecentAlerts = (associationId?: string): Alert[] => {
  const allAlerts = getAllAlerts();
  
  // If an association ID is provided, filter alerts for that association
  if (associationId) {
    return allAlerts.filter(alert => 
      alert.associationId === associationId || 
      alert.scope === 'global'
    );
  }
  
  // Otherwise, return alerts marked as recent or sorted by date
  return allAlerts
    .filter(alert => alert.isRecent || alert.scope === 'global')
    .sort((a, b) => {
      // Sort by severity first (critical > high > medium > low)
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      
      // Then sort by date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
};

// Function to get alerts for a specific association
export const getAlertsForAssociation = async (associationId: string): Promise<Alert[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredAlerts = mockAlerts.filter(
        alert => alert.associationId === associationId || alert.scope === 'global'
      );
      resolve(filteredAlerts);
    }, 500);
  });
};

// Function to get alerts by severity
export const getAlertsBySeverity = (severity: Alert['severity']): Alert[] => {
  return mockAlerts.filter(alert => alert.severity === severity);
};
