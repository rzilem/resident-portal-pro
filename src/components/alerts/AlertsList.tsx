
import React, { useState, useEffect } from 'react';
import { Alert } from '@/types/alert';
import AlertItem from './AlertItem';
import { fetchViolations } from '@/utils/alerts';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

interface AlertsListProps {
  associationId?: string;
  limit?: number;
}

const AlertsList: React.FC<AlertsListProps> = ({ associationId, limit }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setLoading(true);
        const data = await fetchViolations(associationId);
        
        // Apply limit if provided
        const limitedData = limit ? data.slice(0, limit) : data;
        
        setAlerts(limitedData);
      } catch (err) {
        console.error('Error loading alerts:', err);
        setError('Failed to load alerts');
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, [associationId, limit]);

  const handleStatusUpdate = (alertId: string, newStatus: Alert['status']) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: newStatus } 
          : alert
      )
    );
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 border rounded-md flex">
            <Skeleton className="h-10 w-10 rounded-full mr-3" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <AlertCircle className="mx-auto h-10 w-10 mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <AlertCircle className="mx-auto h-10 w-10 mb-2 opacity-50" />
        <p>No alerts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <AlertItem 
          key={alert.id} 
          alert={alert} 
          onStatusUpdate={handleStatusUpdate}
        />
      ))}
    </div>
  );
};

export default AlertsList;
