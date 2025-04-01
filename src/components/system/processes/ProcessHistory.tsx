
import React from 'react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarClock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const mockHistoryData = [
  {
    id: '1',
    processName: 'Daily Email Notifications',
    processType: 'email-notification',
    startTime: new Date(Date.now() - 3600000).toISOString(),
    endTime: new Date(Date.now() - 3550000).toISOString(),
    status: 'completed',
    details: 'Sent 24 emails successfully'
  },
  {
    id: '2',
    processName: 'Weekly Data Cleanup',
    processType: 'data-cleanup',
    startTime: new Date(Date.now() - 86400000).toISOString(),
    endTime: new Date(Date.now() - 86350000).toISOString(),
    status: 'completed',
    details: 'Removed 156 temporary files'
  },
  {
    id: '3',
    processName: 'Monthly Report Generation',
    processType: 'report-generation',
    startTime: new Date(Date.now() - 259200000).toISOString(),
    endTime: new Date(Date.now() - 259100000).toISOString(),
    status: 'failed',
    details: 'Error connecting to database',
    error: 'Database connection timeout'
  }
];

const ProcessHistory = () => {
  const [isLoading] = React.useState(false);
  const historyData = mockHistoryData;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <CalendarClock className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
      case 'running':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Running</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm:ss a');
  };

  const getDuration = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const durationMs = endTime - startTime;
    
    if (durationMs < 1000) {
      return `${durationMs}ms`;
    } else if (durationMs < 60000) {
      return `${Math.round(durationMs / 1000)}s`;
    } else {
      const minutes = Math.floor(durationMs / 60000);
      const seconds = Math.round((durationMs % 60000) / 1000);
      return `${minutes}m ${seconds}s`;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground pb-2">
        This shows the recent execution history of scheduled processes. Historical data will be implemented in a future update.
      </p>
      
      {historyData.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <p>No process execution history available yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {historyData.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/40 transition-colors">
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  {getStatusIcon(item.status)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                    <h3 className="font-medium">{item.processName}</h3>
                    {getStatusBadge(item.status)}
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    <span>Started: {formatDate(item.startTime)}</span>
                    {item.endTime && (
                      <span className="ml-4">
                        Duration: {getDuration(item.startTime, item.endTime)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm">{item.details}</p>
                  {item.error && (
                    <p className="text-sm text-red-500 mt-1">Error: {item.error}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProcessHistory;
