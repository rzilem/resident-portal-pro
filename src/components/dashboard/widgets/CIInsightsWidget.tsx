import React, { useState } from 'react';
import { Bot, ArrowRight, ChevronRight, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AnalysisAlert from '@/components/alerts/AnalysisAlert';
import { Alert } from '@/types/alert';
import { getRecentAlerts } from '@/utils/alerts/alertQueries';
import { useAssociations } from '@/hooks/use-associations';

interface CIInsightsWidgetProps {
  className?: string;
}

const CIInsightsWidget: React.FC<CIInsightsWidgetProps> = ({ className }) => {
  const [expanded, setExpanded] = useState(false);
  const { activeAssociation } = useAssociations();
  
  // Fetch recent alerts, optionally filtered by the active association
  const alerts = getRecentAlerts(activeAssociation?.id);
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
  const highAlerts = alerts.filter(alert => alert.severity === 'high');
  
  const totalAlerts = alerts.length;
  const criticalCount = criticalAlerts.length;
  const highCount = highAlerts.length;
  
  const displayedAlerts = expanded ? alerts : alerts.slice(0, 2);
  
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bot className="h-4 w-4" />
          CI Insights
        </CardTitle>
        <Badge variant="secondary">
          {totalAlerts} Alerts
        </Badge>
      </CardHeader>
      <CardContent>
        {totalAlerts === 0 ? (
          <div className="text-center py-6">
            <AlertTriangle className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No alerts found</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {displayedAlerts.map(alert => (
              <li key={alert.id}>
                <AnalysisAlert alert={alert} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      {totalAlerts > 2 && (
        <CardFooter className="flex justify-center">
          <Button variant="link" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Show Less' : 'Show All'} <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CIInsightsWidget;
