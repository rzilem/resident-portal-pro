
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import MessageDialog from './MessageDialog';
import StatusActions from './StatusActions';
import DeleteConfirmation from './DeleteConfirmation';
import { BidRequestActions } from './types';

const ActionsCard: React.FC<BidRequestActions> = ({ 
  id, 
  updating, 
  deleting, 
  onStatusUpdate, 
  onDelete
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <MessageDialog />
        
        <Separator />
        
        <StatusActions 
          id={id} 
          currentStatus="" // This will be set in the parent component
          onStatusUpdate={onStatusUpdate}
          updating={updating}
        />
        
        <Separator />
        
        <DeleteConfirmation onDelete={onDelete} deleting={deleting} />
      </CardContent>
    </Card>
  );
};

export default ActionsCard;
