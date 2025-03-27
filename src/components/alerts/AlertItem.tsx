
import React from 'react';
import { Alert as AlertType } from '@/types/alert';
import { updateAlertStatus } from '@/utils/alerts';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, DollarSign, FileCog, FileWarning, Info } from 'lucide-react';
import FixThisButton from './FixThisButton';
import { formatDistanceToNow } from 'date-fns';

interface AlertItemProps {
  alert: AlertType;
  onStatusUpdate?: (alertId: string, newStatus: AlertType['status']) => void;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, onStatusUpdate }) => {
  const getAlertIcon = (category: AlertType['category']) => {
    switch (category) {
      case 'financial':
        return <DollarSign className="h-5 w-5 text-amber-500" />;
      case 'maintenance':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'security':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'compliance':
        return <FileWarning className="h-5 w-5 text-red-500" />;
      case 'engagement':
        return <Info className="h-5 w-5 text-indigo-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getSeverityColor = (severity: AlertType['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'high': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    }
  };
  
  const getStatusColor = (status: AlertType['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'in-progress': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'dismissed': return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'Unknown time';
    }
  };
  
  return (
    <div className="p-3 border rounded-md hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-2">
        <div className="mt-0.5">{getAlertIcon(alert.category)}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-medium">{alert.title}</h4>
            <Badge className={getSeverityColor(alert.severity)} variant="secondary">
              {alert.severity}
            </Badge>
            <Badge className={getStatusColor(alert.status)} variant="secondary">
              {alert.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs flex items-center text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {formatTimestamp(alert.createdAt)}
            </span>
            
            {(alert.status === 'new' || alert.status === 'in-progress') && (
              <FixThisButton 
                alert={alert} 
                variant="outline" 
                size="sm"
                className="h-7"
                onStatusUpdate={onStatusUpdate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertItem;
