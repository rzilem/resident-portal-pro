
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface ViolationStatusBadgeProps {
  status: string;
}

const ViolationStatusBadge: React.FC<ViolationStatusBadgeProps> = ({ status }) => {
  switch (status.toLowerCase()) {
    case 'open':
      return <Badge variant="default">Open</Badge>;
    case 'resolved':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolved</Badge>;
    case 'pending':
      return <Badge variant="secondary">Pending</Badge>;
    case 'scheduled':
      return <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default ViolationStatusBadge;
