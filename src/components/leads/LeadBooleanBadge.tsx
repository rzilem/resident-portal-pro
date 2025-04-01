
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface LeadBooleanBadgeProps {
  value?: boolean;
}

const LeadBooleanBadge: React.FC<LeadBooleanBadgeProps> = ({ value }) => {
  if (value === undefined) return <>-</>;
  
  return value ? (
    <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">Yes</Badge>
  ) : (
    <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">No</Badge>
  );
};

export default LeadBooleanBadge;
