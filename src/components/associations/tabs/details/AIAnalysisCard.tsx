import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Analysis } from '@/types/analysis';
import AnalysisAlert from '@/components/alerts/AnalysisAlert';
import { getAlertsForAssociation } from '@/utils/alerts/alertQueries';
import { Alert } from '@/types/alert';

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
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bot className="h-4 w-4" />
          AI Analysis
        </CardTitle>
        <Button variant="ghost" size="sm">
          View All <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardHeader>
      <CardContent>
        {alerts.length > 0 ? (
          alerts.map(alert => (
            <AnalysisAlert key={alert.id} alert={alert} />
          ))
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

