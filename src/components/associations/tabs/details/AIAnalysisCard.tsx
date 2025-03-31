
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/types/alert';
import AnalysisAlert from '@/components/alerts/AnalysisAlert';
import { getAlertsForAssociation } from '@/utils/alerts/alertQueries';
import FixThisButton from '@/components/alerts/FixThisButton';

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
                <div className="flex flex-col">
                  <h4 className="text-sm font-medium">{alert.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 mb-2">{alert.description}</p>
                  <div className="flex justify-end">
                    <FixThisButton 
                      alert={alert} 
                      variant="default" 
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow text-xs py-1 h-7"
                    />
                  </div>
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
