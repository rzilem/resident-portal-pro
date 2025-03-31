
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/types/alert';
import AnalysisAlert from '@/components/alerts/AnalysisAlert';
import { getAlertsForAssociation } from '@/utils/alerts/alertQueries';
import FixThisButton from '@/components/alerts/FixThisButton';
import { Badge } from '@/components/ui/badge';

interface AIAnalysisCardProps {
  className?: string;
  associationId: string;
}

const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({ className = '', associationId }) => {
  const [alerts, setAlerts] = React.useState<Alert[]>([]);

  React.useEffect(() => {
    const fetchAlerts = async () => {
      const fetchedAlerts = await getAlertsForAssociation(associationId);
      setAlerts(fetchedAlerts);
    };

    fetchAlerts();
  }, [associationId]);
  
  const getSeverityBadgeStyle = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'high': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
    }
  };
  
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bot className="h-4 w-4 text-blue-600" />
          <span className="font-semibold text-blue-800 dark:text-blue-400">AI Analysis</span>
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-blue-600">
          View All <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardHeader>
      <CardContent>
        {alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className="relative border rounded-lg p-3 hover:shadow-sm transition-shadow bg-white dark:bg-gray-950">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{alert.title}</h4>
                      <Badge className={`${getSeverityBadgeStyle(alert.severity)} ml-1 shrink-0`} variant="secondary">
                        {alert.severity}
                      </Badge>
                    </div>
                    <FixThisButton 
                      alert={alert} 
                      variant="default" 
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow text-xs py-0.5 h-6 px-2 ml-2 shrink-0"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            No recent insights
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAnalysisCard;
