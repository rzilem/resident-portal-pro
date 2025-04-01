
import React from 'react';
import { LeadStatus } from "@/types/lead";

interface LeadStatusBadgeProps {
  status: LeadStatus;
}

const LeadStatusBadge: React.FC<LeadStatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    'new': { label: 'New', class: 'bg-blue-100 text-blue-800' },
    'contacted': { label: 'Contacted', class: 'bg-yellow-100 text-yellow-800' },
    'qualified': { label: 'Qualified', class: 'bg-indigo-100 text-indigo-800' },
    'proposal': { label: 'Proposal', class: 'bg-purple-100 text-purple-800' },
    'negotiation': { label: 'Negotiation', class: 'bg-orange-100 text-orange-800' },
    'closed-won': { label: 'Closed (Won)', class: 'bg-green-100 text-green-800' },
    'closed-lost': { label: 'Closed (Lost)', class: 'bg-red-100 text-red-800' },
  };
  
  const config = statusConfig[status];
  
  return (
    <div className={`px-2 py-1 rounded-full text-xs inline-block ${config.class}`}>
      {config.label}
    </div>
  );
};

export default LeadStatusBadge;
