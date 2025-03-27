
import { v4 as uuid } from 'uuid';
import { toast } from 'sonner';
import { Alert, AlertStatus } from '@/types/alert';
import { alertsDatabase } from '@/data/mockAlerts';
import { getAlertById } from './alertQueries';

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

export const createAlert = (alert: Omit<Alert, 'id' | 'createdAt' | 'status'>): Alert => {
  const newAlert: Alert = {
    id: uuid(),
    ...alert,
    createdAt: new Date().toISOString(),
    status: 'new'
  };
  
  alertsDatabase.push(newAlert);
  toast.info(`New alert: ${newAlert.title}`, {
    description: newAlert.description
  });
  
  return newAlert;
};
