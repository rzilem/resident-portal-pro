
import React, { useState } from 'react';
import { Bot, AlertTriangle, ChevronRight, BellRing } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AnalysisAlert from '@/components/alerts/AnalysisAlert';
import FixThisButton from '@/components/alerts/FixThisButton';
import { Alert } from '@/types/alert';
import { getRecentAlerts } from '@/utils/alerts/alertQueries';
import { useAssociations } from '@/hooks/use-associations';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface CIInsightsWidgetProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  cardClass?: string;
}

const CIInsightsWidget: React.FC<CIInsightsWidgetProps> = ({ className, size, cardClass }) => {
  const [expanded, setExpanded] = useState(false);
  const { activeAssociation } = useAssociations();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const alerts = getRecentAlerts(activeAssociation?.id);
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
  const highAlerts = alerts.filter(alert => alert.severity === 'high');
  
  const totalAlerts = alerts.length;
  const criticalCount = criticalAlerts.length;
  const highCount = highAlerts.length;
  
  const displayedAlerts = expanded ? alerts : alerts.slice(0, 3);
  
  const getSeverityBadgeStyle = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300';
      case 'high': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
    }
  };

  const handleFixAlert = (alert: Alert, e: React.MouseEvent) => {
    // Prevent default behavior
    e.preventDefault();
    e.stopPropagation();
    
    toast({
      title: "Fixing Issue",
      description: `Starting fix workflow for: ${alert.title}`,
    });
    
    // Instead of navigating away, we handle the fix in place
    // The FixThisButton dialog will now be shown
  };
  
  const handleViewAllAlerts = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (totalAlerts <= 3) {
      return; // Don't do anything if there are 3 or fewer alerts
    }
    
    if (expanded) {
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  };
  
  const handleAlertClick = (alert: Alert, e: React.MouseEvent) => {
    // Prevent default navigation
    e.preventDefault();
    e.stopPropagation();
    
    // Display the alert information in a toast instead of navigating
    toast({
      title: "Alert Selected",
      description: `${alert.title}: ${alert.description}`,
      duration: 5000,
    });
  };
  
  return (
    <Card className={cardClass || className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bot className="h-4 w-4 text-blue-600" />
          <span className="font-semibold text-blue-800 dark:text-blue-400">CI Insights</span>
        </CardTitle>
        <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 font-medium">
          {totalAlerts} Alerts
        </Badge>
      </CardHeader>
      <CardContent className="pt-3 px-3">
        {totalAlerts === 0 ? (
          <div className="text-center py-6">
            <AlertTriangle className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No alerts found</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-3">
              {criticalCount > 0 && (
                <Badge className={`${getSeverityBadgeStyle('critical')} inline-flex items-center py-1 px-2`}>
                  <BellRing className="h-3 w-3 mr-1.5 animate-pulse text-indigo-600" />
                  <span className="text-xs">{criticalCount} Critical</span>
                </Badge>
              )}
              {highCount > 0 && (
                <Badge className={getSeverityBadgeStyle('high')}>
                  {highCount} High
                </Badge>
              )}
            </div>
            <ul className="space-y-3">
              {displayedAlerts.map(alert => (
                <li 
                  key={alert.id} 
                  className="relative border rounded-lg p-3 hover:shadow-sm transition-shadow bg-white dark:bg-gray-950 cursor-pointer"
                  onClick={(e) => handleAlertClick(alert, e)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        {alert.severity === 'critical' && (
                          <BellRing className="h-3 w-3 text-blue-600 animate-pulse shrink-0" />
                        )}
                        <h4 className="text-sm font-medium truncate">{alert.title}</h4>
                        <Badge className={`${getSeverityBadgeStyle(alert.severity)} ml-1.5 shrink-0`} variant="secondary">
                          {alert.severity}
                        </Badge>
                      </div>
                      <FixThisButton 
                        alert={alert} 
                        variant="default" 
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow text-xs py-0.5 h-6 px-2 ml-2 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFixAlert(alert, e);
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{alert.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
      {totalAlerts > 3 && (
        <CardFooter className="flex justify-center pt-0 pb-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleViewAllAlerts}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-xs h-7"
          >
            {expanded ? 'Show Less' : 'Show All'} 
            <ChevronRight className={`h-3 w-3 ml-1 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CIInsightsWidget;
