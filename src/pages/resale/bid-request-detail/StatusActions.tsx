
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { StatusUpdateProps } from './types';

const StatusActions: React.FC<StatusUpdateProps> = ({ id, currentStatus, onStatusUpdate, updating }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Update Status</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          className="text-green-600 border-green-200 hover:bg-green-50"
          disabled={updating || currentStatus === 'accepted'}
          onClick={() => onStatusUpdate('accepted')}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Accept
        </Button>
        <Button 
          variant="outline" 
          className="text-red-600 border-red-200 hover:bg-red-50"
          disabled={updating || currentStatus === 'rejected'}
          onClick={() => onStatusUpdate('rejected')}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Reject
        </Button>
      </div>
    </div>
  );
};

export default StatusActions;
