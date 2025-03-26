
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, TrendingDown, TrendingUp, DollarSign, BarChart2 } from 'lucide-react';
import { useAssociations } from '@/hooks/use-associations';

interface CIInsightsWidgetProps {
  cardClass?: string;
  size?: 'small' | 'medium' | 'large';
}

const CIInsightsWidget = ({ cardClass, size = 'medium' }: CIInsightsWidgetProps) => {
  const { activeAssociation } = useAssociations();
  const [category, setCategory] = useState<'all' | 'urgent' | 'financial' | 'operational'>('all');
  
  // Sample insights data - in a real app, this would come from an API/backend
  const insights = [
    {
      id: 1,
      type: 'urgent',
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      title: 'Reserve Transfer Needed',
      description: 'Sunset Heights HOA operating account balance is critically low. Consider transferring funds from reserves.',
      association: 'Sunset Heights HOA',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      type: 'financial',
      icon: <TrendingDown className="h-5 w-5 text-amber-500" />,
      title: 'Negative Cash Flow',
      description: 'Ocean View Condos has been running negative cash flow for 4 months in a row. Review monthly expenses.',
      association: 'Ocean View Condos',
      timestamp: '1 day ago',
    },
    {
      id: 3,
      type: 'financial',
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
      title: 'Delinquency Increase',
      description: 'Delinquency rate has increased by 8% this month. Consider reviewing collection procedures.',
      association: activeAssociation?.name || 'Current Association',
      timestamp: '3 days ago',
    },
    {
      id: 4,
      type: 'operational',
      icon: <Info className="h-5 w-5 text-blue-500" />,
      title: 'Insurance Renewal',
      description: 'Property insurance policy renewal is due in 30 days. Begin gathering quotes now.',
      association: activeAssociation?.name || 'Current Association',
      timestamp: '1 week ago',
    },
    {
      id: 5,
      type: 'operational',
      icon: <BarChart2 className="h-5 w-5 text-indigo-500" />,
      title: 'Budget Review Due',
      description: 'Annual budget review should be scheduled within the next 2 weeks to prepare for board approval.',
      association: 'Mountain Valley Association',
      timestamp: '2 weeks ago',
    },
  ];
  
  // Filter insights based on the selected category
  const filteredInsights = category === 'all'
    ? insights
    : insights.filter(insight => insight.type === category);
  
  return (
    <Card className={`${cardClass}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Info className="h-6 w-6 text-blue-600" />
          <h3 className="font-medium">CI Insights</h3>
        </div>
        
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          <Button 
            variant={category === 'all' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setCategory('all')}
            className="text-xs h-7"
          >
            All
          </Button>
          <Button 
            variant={category === 'urgent' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setCategory('urgent')}
            className="text-xs h-7"
          >
            Urgent
          </Button>
          <Button 
            variant={category === 'financial' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setCategory('financial')}
            className="text-xs h-7"
          >
            Financial
          </Button>
          <Button 
            variant={category === 'operational' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setCategory('operational')}
            className="text-xs h-7"
          >
            Operational
          </Button>
        </div>
        
        <div className="space-y-3 overflow-y-auto" style={{ maxHeight: size === 'large' ? '350px' : '250px' }}>
          {filteredInsights.length > 0 ? (
            filteredInsights.map(insight => (
              <div 
                key={insight.id} 
                className="p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">{insight.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs font-medium text-blue-600">{insight.association}</span>
                      <span className="text-xs text-muted-foreground">{insight.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-muted-foreground">
              No insights available for this category
            </div>
          )}
        </div>
        
        {size !== 'small' && (
          <div className="mt-3 text-xs text-muted-foreground text-center">
            Powered by Community Intelligence
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CIInsightsWidget;
