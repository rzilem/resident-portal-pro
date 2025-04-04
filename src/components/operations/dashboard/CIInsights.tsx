
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const insightsData = [
  {
    id: 1,
    title: 'ARC Request Response Time Issues',
    description: 'Response time for ARC requests has increased by 24% in the Austin office over the last 30 days. Review team capacity and processes.',
    type: 'alert',
    priority: 'high',
    action: 'Review Team Capacity',
    actionLink: '#',
    dateDetected: '2023-04-01'
  },
  {
    id: 2,
    title: 'Invoice Processing Bottleneck',
    description: 'There appears to be a bottleneck in invoice processing for Lakeside HOA. Consider rebalancing invoice workload among accounting teams.',
    type: 'opportunity',
    priority: 'medium',
    action: 'Rebalance Workload',
    actionLink: '#',
    dateDetected: '2023-04-02'
  },
  {
    id: 3,
    title: 'Team Performance Improvement',
    description: 'Team B has improved response times by 15% after implementing the new request tracking system. Consider expanding this approach to other teams.',
    type: 'success',
    priority: 'medium',
    action: 'Expand Approach',
    actionLink: '#',
    dateDetected: '2023-04-03'
  },
  {
    id: 4,
    title: 'Seasonal Pool Key Request Increase',
    description: 'Historical data suggests pool key requests will increase by 45% in the next month. Consider proactive staffing adjustments.',
    type: 'prediction',
    priority: 'medium',
    action: 'Adjust Staffing',
    actionLink: '#',
    dateDetected: '2023-04-04'
  }
];

const CIInsights: React.FC = () => {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium Priority</Badge>;
      case 'low':
        return <Badge variant="outline">Low Priority</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'opportunity':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'prediction':
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
    }
  };
  
  return (
    <div className="space-y-4">
      {insightsData.map((insight) => (
        <Card key={insight.id} className="transition-all hover:shadow-md border-l-4" 
          style={{ 
            borderLeftColor: 
              insight.type === 'alert' ? 'rgb(239, 68, 68)' : 
              insight.type === 'opportunity' ? 'rgb(59, 130, 246)' : 
              insight.type === 'success' ? 'rgb(34, 197, 94)' : 
              'rgb(245, 158, 11)' 
          }}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getTypeIcon(insight.type)}
                <CardTitle className="text-lg">{insight.title}</CardTitle>
              </div>
              {getPriorityBadge(insight.priority)}
            </div>
            <CardDescription className="text-sm text-muted-foreground">
              Detected on {new Date(insight.dateDetected).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{insight.description}</p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" size="sm" asChild>
              <a href={insight.actionLink}>{insight.action}</a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CIInsights;
