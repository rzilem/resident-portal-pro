
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

interface ViolationStatusBadgeProps {
  status: string;
}

const ViolationStatusBadge: React.FC<ViolationStatusBadgeProps> = ({ status }) => {
  const getStatusDetails = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return {
          label: 'Open',
          className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
          icon: <AlertCircle className="h-3 w-3 mr-1" />
        };
      case 'in-progress':
        return {
          label: 'In Progress',
          className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
          icon: <Clock className="h-3 w-3 mr-1" />
        };
      case 'resolved':
        return {
          label: 'Resolved',
          className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
          icon: <CheckCircle className="h-3 w-3 mr-1" />
        };
      case 'dismissed':
        return {
          label: 'Dismissed',
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400',
          icon: <XCircle className="h-3 w-3 mr-1" />
        };
      default:
        return {
          label: status,
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400',
          icon: null
        };
    }
  };

  const { label, className, icon } = getStatusDetails(status);

  return (
    <Badge className={`flex items-center px-2 py-0.5 ${className}`} variant="outline">
      {icon}
      {label}
    </Badge>
  );
};

export default ViolationStatusBadge;
