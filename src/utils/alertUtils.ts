
import { v4 as uuid } from 'uuid';
import { toast } from 'sonner';
import { workflowService } from '@/services/workflowService';

// Alert and workflow related types
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

export type AlertType = 'financial' | 'operational' | 'compliance' | 'governance' | 'maintenance';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'new' | 'in-progress' | 'resolved' | 'dismissed';

export interface AlertSolution {
  id: string;
  title: string;
  description: string;
  actionType: 'workflow' | 'notification' | 'manual';
  workflowTemplateId?: string;
  action: () => Promise<void>;
}

// Mock database for alerts until we have real backend storage
let alertsDatabase: Alert[] = [
  {
    id: '1',
    title: 'Reserve Transfer Needed',
    description: 'Sunset Heights HOA operating account balance is critically low. Consider transferring funds from reserves.',
    type: 'financial',
    severity: 'critical',
    associationId: 'sunset-heights',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    status: 'new',
    solutions: [
      {
        id: '1-1',
        title: 'Transfer Funds',
        description: 'Initiate a transfer of funds from reserve account to operating account',
        actionType: 'workflow',
        workflowTemplateId: 'fund-transfer',
        action: async () => {/* Will be implemented */}
      },
      {
        id: '1-2',
        title: 'Schedule Board Vote',
        description: 'Schedule emergency board vote to approve reserve transfer',
        actionType: 'workflow',
        workflowTemplateId: 'board-vote',
        action: async () => {/* Will be implemented */}
      }
    ]
  },
  {
    id: '2',
    title: 'Insurance Renewal',
    description: 'Property insurance policy renewal is due in 30 days. Begin gathering quotes now.',
    type: 'operational',
    severity: 'high',
    timestamp: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
    status: 'new',
    solutions: [
      {
        id: '2-1',
        title: 'Request Quotes',
        description: 'Send requests for quotes to preferred insurance providers',
        actionType: 'workflow',
        workflowTemplateId: 'insurance-quotes',
        action: async () => {/* Will be implemented */}
      },
      {
        id: '2-2',
        title: 'Schedule Review',
        description: 'Schedule insurance review meeting with board',
        actionType: 'workflow',
        workflowTemplateId: 'schedule-meeting',
        action: async () => {/* Will be implemented */}
      }
    ]
  },
  {
    id: '3',
    title: 'Delinquency Increase',
    description: 'Delinquency rate has increased by 8% this month. Consider reviewing collection procedures.',
    type: 'financial',
    severity: 'medium',
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    status: 'new',
    solutions: [
      {
        id: '3-1',
        title: 'Send Reminders',
        description: 'Send payment reminders to delinquent accounts',
        actionType: 'workflow',
        workflowTemplateId: 'payment-reminders',
        action: async () => {/* Will be implemented */}
      },
      {
        id: '3-2',
        title: 'Review Collection Policy',
        description: 'Review and update collection procedures',
        actionType: 'manual',
        action: async () => {/* Will be implemented */}
      }
    ]
  }
];

// Utility functions for alerts
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

export const updateAlertStatus = (id: string, status: AlertStatus): Alert | undefined => {
  const alertIndex = alertsDatabase.findIndex(alert => alert.id === id);
  if (alertIndex === -1) return undefined;
  
  alertsDatabase[alertIndex] = {
    ...alertsDatabase[alertIndex],
    status
  };
  
  toast.success(`Alert status updated to ${status}`);
  return alertsDatabase[alertIndex];
};

export const createAlert = (alert: Omit<Alert, 'id' | 'timestamp' | 'status'>): Alert => {
  const newAlert: Alert = {
    id: uuid(),
    ...alert,
    timestamp: new Date().toISOString(),
    status: 'new'
  };
  
  alertsDatabase.push(newAlert);
  toast.info(`New alert: ${newAlert.title}`, {
    description: newAlert.description
  });
  
  return newAlert;
};

export const implementSolution = async (alertId: string, solutionId: string): Promise<boolean> => {
  const alert = getAlertById(alertId);
  if (!alert) return false;
  
  const solution = alert.solutions.find(s => s.id === solutionId);
  if (!solution) return false;
  
  try {
    // Execute the solution's action
    await solution.action();
    
    // Update alert status to in-progress
    updateAlertStatus(alertId, 'in-progress');
    
    // Show toast notification
    toast.success(`Solution initiated: ${solution.title}`, {
      description: `Working on: ${alert.title}`
    });
    
    return true;
  } catch (error) {
    console.error('Error implementing solution:', error);
    
    toast.error('Failed to implement solution', {
      description: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return false;
  }
};

// New function to check workflow progress and update alert status
export const checkWorkflowProgressForAlert = async (alertId: string): Promise<void> => {
  const alert = getAlertById(alertId);
  if (!alert || !alert.relatedWorkflowId) return;
  
  try {
    const workflow = await workflowService.getWorkflowById(alert.relatedWorkflowId);
    
    // If the workflow is completed, mark the alert as resolved
    if (workflow.status === 'completed') {
      updateAlertStatus(alertId, 'resolved');
      toast.success(`Alert "${alert.title}" resolved`, {
        description: "The associated workflow has been completed"
      });
    }
  } catch (error) {
    console.error('Error checking workflow progress:', error);
  }
};

// Implementation of solution actions
// These would typically initiate workflows, create tasks, or trigger other actions
export const initializeSolutionActions = (): void => {
  // Find all solutions across all alerts and implement their action functions
  alertsDatabase = alertsDatabase.map(alert => ({
    ...alert,
    solutions: alert.solutions.map(solution => {
      // Create appropriate action functions based on solution type
      let actionFn: () => Promise<void>;
      
      if (solution.actionType === 'workflow' && solution.workflowTemplateId) {
        actionFn = async () => {
          console.log(`Starting workflow: ${solution.workflowTemplateId} for alert: ${alert.id}`);
          // In a real implementation, this would create a workflow with the correct template
          try {
            // This is just the initialization, the actual workflow creation happens in the FixThisButton component
            return Promise.resolve();
          } catch (err) {
            console.error('Failed to initialize workflow:', err);
            return Promise.reject(err);
          }
        };
      } else {
        actionFn = async () => {
          console.log(`Executing manual action for solution: ${solution.id}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        };
      }
      
      return {
        ...solution,
        action: actionFn
      };
    })
  }));
};

// Initialize solution actions on module load
initializeSolutionActions();
