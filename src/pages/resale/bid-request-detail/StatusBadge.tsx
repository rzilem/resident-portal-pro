
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

export const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'secondary';
    case 'accepted':
      return 'success';
    case 'rejected':
      return 'destructive';
    case 'completed':
      return 'default';
    default:
      return 'outline';
  }
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <Badge variant={getStatusBadgeVariant(status)}>
      {status}
    </Badge>
  );
};

export default StatusBadge;
