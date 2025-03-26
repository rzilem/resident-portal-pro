
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { isAfter, addMonths, parseISO } from 'date-fns';

interface InsuranceStatusBadgeProps {
  expirationDate?: string;
}

export const InsuranceStatusBadge: React.FC<InsuranceStatusBadgeProps> = ({ expirationDate }) => {
  if (!expirationDate) return null;
  
  const isExpired = isAfter(new Date(), parseISO(expirationDate));
  const isExpiringSoon = !isExpired && isAfter(addMonths(new Date(), 1), parseISO(expirationDate));
  
  if (isExpired) {
    return <Badge variant="destructive" className="ml-2">Expired</Badge>;
  }
  
  if (isExpiringSoon) {
    return <Badge variant="outline" className="ml-2 bg-amber-500 text-white border-amber-600">Expiring Soon</Badge>;
  }
  
  return <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-300">Active</Badge>;
};
