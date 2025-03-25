
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench } from "lucide-react";

interface MaintenanceWidgetProps {
  size?: 'small' | 'medium' | 'large';
}

const MaintenanceWidget = ({ size = 'medium' }: MaintenanceWidgetProps) => {
  // Mock maintenance requests
  const maintenanceRequests = [
    { id: '1', unit: '203', issue: 'Leaking faucet', priority: 'medium', status: 'pending' },
    { id: '2', unit: '105', issue: 'HVAC not working', priority: 'high', status: 'in-progress' },
    { id: '3', unit: '310', issue: 'Light fixture broken', priority: 'low', status: 'pending' },
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="default">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Wrench className="h-4 w-4" /> Maintenance Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {maintenanceRequests.map((request) => (
            <div key={request.id} className="border-b pb-3 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium">Unit {request.unit}</span>
                {getPriorityBadge(request.priority)}
              </div>
              <p className="text-sm text-muted-foreground">{request.issue}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceWidget;
