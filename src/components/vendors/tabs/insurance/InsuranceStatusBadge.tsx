
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface InsuranceStatusBadgeProps {
  isExpired: boolean;
}

const InsuranceStatusBadge: React.FC<InsuranceStatusBadgeProps> = ({ isExpired }) => {
  return isExpired ? (
    <Badge variant="destructive" className="gap-1 py-1">
      <AlertTriangle className="h-3.5 w-3.5" />
      <span>Expired</span>
    </Badge>
  ) : (
    <Badge variant="outline" className="gap-1 py-1 border-green-200 bg-green-50 text-green-700">
      <CheckCircle className="h-3.5 w-3.5" />
      <span>Active</span>
    </Badge>
  );
};

export default InsuranceStatusBadge;
