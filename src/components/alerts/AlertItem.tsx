
import React from 'react';
import { Alert as AlertType } from '@/types/alert';
import { updateAlertStatus } from '@/utils/alerts';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, DollarSign, FileCog, FileWarning, Info, BellRing } from 'lucide-react';
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
        return <DollarSign className="h-5 w-5 text-blue-500" />;
      case 'maintenance':
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      case 'security':
        return <AlertTriangle className="h-5 w-5 text-blue-600" />;
      case 'compliance':
        return <FileWarning className="h-5 w-5 text-indigo-600" />;
      case 'engagement':
        return <Info className="h-5 w-5 text-indigo-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getSeverityColor = (severity: AlertType['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'high': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    }
  };
  
  const getStatusColor = (status: AlertType['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'in-progress': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
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
  
  const handleAlertClick = (e: React.MouseEvent) => {
    // Prevent navigating away from the current page
    e.preventDefault();
    // Any other alert click handling could go here
  };
  
  return (
    <div 
      className="p-3 border rounded-md hover:bg-muted/50 transition-colors"
      onClick={handleAlertClick}
    >
      <div className="flex items-start gap-2">
        <div className="mt-0.5">{getAlertIcon(alert.category)}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <h4 className="text-sm font-medium flex items-center truncate">
                {alert.severity === 'critical' && (
                  <BellRing className="h-3 w-3 mr-1.5 text-indigo-600 animate-pulse shrink-0" />
                )}
                <span className="truncate">{alert.title}</span>
              </h4>
              <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                <Badge className={getSeverityColor(alert.severity)} variant="secondary">
                  {alert.severity}
                </Badge>
                <Badge className={getStatusColor(alert.status)} variant="secondary">
                  {alert.status}
                </Badge>
              </div>
            </div>
            
            {(alert.status === 'new' || alert.status === 'in-progress') && (
              <FixThisButton 
                alert={alert} 
                variant="default" 
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white h-6 text-xs px-2 py-0 ml-2 shrink-0"
                onStatusUpdate={onStatusUpdate}
              />
            )}
          </div>
          <p className="text-xs text-muted-foreground">{alert.description}</p>
          <span className="text-xs flex items-center text-muted-foreground mt-1.5">
            <Clock className="h-3 w-3 mr-1" />
            {formatTimestamp(alert.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AlertItem;
