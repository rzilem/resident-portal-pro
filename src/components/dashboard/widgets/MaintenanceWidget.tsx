
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, Plus, AlertTriangle, CheckCircle2, Clock, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface MaintenanceWidgetProps {
  size?: 'small' | 'medium' | 'large';
  cardClass?: string;
}

const MaintenanceWidget = ({ size = 'medium', cardClass = '' }: MaintenanceWidgetProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Sample maintenance requests with real-world scenarios
  const requests = [
    { id: 1, title: 'Broken irrigation system', property: 'Pine Gardens', unit: '101', assignee: 'John Doe', status: 'urgent', date: '2023-10-02' },
    { id: 2, title: 'Hallway light replacement', property: 'Maple Residences', unit: '203', assignee: 'Sarah Smith', status: 'in-progress', date: '2023-10-05' },
    { id: 3, title: 'Pool pump maintenance', property: 'Ocean Views', unit: 'Common Area', assignee: 'Tech Team', status: 'scheduled', date: '2023-10-10' },
    { id: 4, title: 'Parking lot restriping', property: 'The Palms', unit: 'Parking', assignee: 'External Vendor', status: 'completed', date: '2023-09-28' },
    { id: 5, title: 'HVAC repair in unit 302', property: 'Birchwood', unit: '302', assignee: 'Tech Team', status: 'urgent', date: '2023-10-03' },
    { id: 6, title: 'Roof leak inspection', property: 'Willow Heights', unit: '401', assignee: 'John Doe', status: 'in-progress', date: '2023-10-04' },
  ];

  // Decide how many requests to show based on size
  const limit = size === 'small' ? 2 : size === 'medium' ? 3 : 5;
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
          icon: <Calendar className="h-4 w-4" />, 
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
  
  const handleRequestClick = (request: any) => {
    navigate(`/maintenance/request/${request.id}`, { 
      state: { requestDetails: request }
    });
    toast({
      title: "Maintenance Request Selected",
      description: `Viewing details for: ${request.title}`,
    });
  };

  const handleNewRequest = () => {
    navigate('/maintenance/new');
    toast({
      title: "New Maintenance Request",
      description: "Creating a new maintenance request",
    });
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
              <li 
                key={request.id} 
                className="p-2 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleRequestClick(request)}
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-medium">{request.title}</p>
                    {size !== 'small' && (
                      <p className="text-xs text-muted-foreground">{request.property} - Unit {request.unit}</p>
                    )}
                  </div>
                  <Badge variant={variant as any} className="flex items-center gap-1">
                    {icon}
                    <span>{label}</span>
                  </Badge>
                </div>
                {size === 'large' && (
                  <div className="mt-2 flex justify-between items-center">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{request.assignee}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {new Date(request.date).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full" onClick={handleNewRequest}>
          <Plus className="h-4 w-4 mr-2" /> New Request
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MaintenanceWidget;
