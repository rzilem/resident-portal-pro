
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, HelpCircle, Code } from 'lucide-react';

interface AssociationStatusCardProps {
  status: string;
  code: string | undefined;
}

const AssociationStatusCard: React.FC<AssociationStatusCardProps> = ({
  status,
  code
}) => {
  // Function to determine the status badge variant and icon
  const getStatusBadge = () => {
    switch (status.toLowerCase()) {
      case 'active':
        return {
          variant: 'success',
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          color: 'text-green-700 bg-green-100'
        };
      case 'pending':
      case 'on hold':
        return {
          variant: 'warning',
          icon: <AlertCircle className="h-4 w-4 mr-1" />,
          color: 'text-amber-700 bg-amber-100'
        };
      case 'inactive':
        return {
          variant: 'destructive',
          icon: <AlertCircle className="h-4 w-4 mr-1" />,
          color: 'text-red-700 bg-red-100'
        };
      default:
        return {
          variant: 'secondary',
          icon: <HelpCircle className="h-4 w-4 mr-1" />,
          color: 'text-gray-700 bg-gray-100'
        };
    }
  };

  const statusInfo = getStatusBadge();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Association Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground">Current Status</div>
          <div className="flex items-center">
            <Badge className={`${statusInfo.color} flex items-center py-1.5 px-3 text-sm font-medium`}>
              {statusInfo.icon}
              {status}
            </Badge>
          </div>
        </div>
        
        {code && (
          <div className="flex flex-col gap-2 pt-2">
            <div className="text-sm text-muted-foreground">Association Code</div>
            <div className="flex items-center">
              <Badge variant="outline" className="flex items-center py-1.5 px-3 text-sm font-medium">
                <Code className="h-4 w-4 mr-1 text-blue-500" />
                {code}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Use this code for resident registration and correspondence
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssociationStatusCard;
