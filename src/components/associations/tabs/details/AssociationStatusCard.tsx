
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AssociationStatusCardProps {
  status: string;
  code: string | undefined;
}

const AssociationStatusCard: React.FC<AssociationStatusCardProps> = ({ status, code }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Association Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="text-muted-foreground text-sm mb-1">Current Status</div>
            <div className="font-medium capitalize">{status}</div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="text-muted-foreground text-sm mb-1">Association Code</div>
            <div className="font-medium">{code}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssociationStatusCard;
