
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Widget } from '@/types/dashboard';

interface CIInsightsWidgetProps {
  widget: Widget;
}

const CIInsightsWidget: React.FC<CIInsightsWidgetProps> = ({ widget }) => {
  // Sample alerts data - in a real app, this would come from an API
  const alerts = [
    {
      id: 1,
      title: 'Insurance Renewal',
      description: 'Property insurance policy renewal is due in 30 days. Begin gathering quotes now.',
      severity: 'high'
    },
    {
      id: 2,
      title: 'Delinquency Increase',
      description: 'Delinquency rate has increased by 8% this month. Consider reviewing collection procedures.',
      severity: 'medium'
    }
  ];

  return (
    <Card className="dashboard-widget-container h-full">
      <CardHeader className="dashboard-card-header">
        <CardTitle className="text-md font-medium flex items-center gap-2">
          <span className="inline-block">{widget.title}</span>
          <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-semibold rounded-full px-2 py-1 ml-2">
            {alerts.length} Alerts
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className="border border-red-100 rounded-lg p-4"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-red-500 font-medium text-lg">{alert.title}</h4>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                      {alert.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No alerts at this time</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CIInsightsWidget;
