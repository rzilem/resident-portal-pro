
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, Plus, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MaintenanceWidgetProps {
  size?: 'small' | 'medium' | 'large';
  cardClass?: string;
}

const MaintenanceWidget = ({ size = 'medium', cardClass = '' }: MaintenanceWidgetProps) => {
  // Sample maintenance requests
  const requests = [
    { id: 1, title: 'Broken irrigation system', property: 'Pine Gardens', status: 'urgent', date: '2023-10-02' },
    { id: 2, title: 'Hallway light replacement', property: 'Maple Residences', status: 'in-progress', date: '2023-10-05' },
    { id: 3, title: 'Pool maintenance', property: 'Ocean Views', status: 'scheduled', date: '2023-10-10' },
    { id: 4, title: 'Parking lot restriping', property: 'The Palms', status: 'completed', date: '2023-09-28' },
  ];

  // Decide how many requests to show based on size
  const limit = size === 'small' ? 2 : size === 'medium' ? 3 : 4;
  const displayedRequests = requests.slice(0, limit);

  // Status badge style and icon
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'urgent':
        return { 
          icon: <AlertTriangle className="h-4 w-4" />, 
          variant: 'destructive',
          label: 'Urgent'
        };
      case 'in-progress':
        return { 
          icon: <Wrench className="h-4 w-4" />, 
          variant: 'default',
          label: 'In Progress'
        };
      case 'scheduled':
        return { 
          icon: <Clock className="h-4 w-4" />, 
          variant: 'outline',
          label: 'Scheduled'
        };
      case 'completed':
        return { 
          icon: <CheckCircle2 className="h-4 w-4" />, 
          variant: 'outline',
          label: 'Completed'
        };
      default:
        return { 
          icon: <Wrench className="h-4 w-4" />, 
          variant: 'outline',
          label: status
        };
    }
  };
  
  return (
    <Card className={`${cardClass}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md">Maintenance Requests</CardTitle>
          <Badge variant="outline">{requests.filter(r => r.status !== 'completed').length} active</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {displayedRequests.map(request => {
            const { icon, variant, label } = getStatusDetails(request.status);
            
            return (
              <li key={request.id} className="p-2 border rounded-md">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-medium">{request.title}</p>
                    {size !== 'small' && (
                      <p className="text-xs text-muted-foreground">{request.property}</p>
                    )}
                  </div>
                  <Badge variant={variant as any} className="flex items-center gap-1">
                    {icon}
                    <span>{label}</span>
                  </Badge>
                </div>
                {size === 'large' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(request.date).toLocaleDateString()}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full">
          <Plus className="h-4 w-4 mr-2" /> New Request
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MaintenanceWidget;
