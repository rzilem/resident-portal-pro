
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Mail, FileText, Phone, Check, X } from "lucide-react";
import { toast } from "sonner";
import { LeadData } from './types';

interface LeadRowActionsProps {
  lead: LeadData;
}

const LeadRowActions: React.FC<LeadRowActionsProps> = ({ lead }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => toast.success('Email sent!')}>
          <Mail className="h-4 w-4 mr-2" />
          Send Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast.success('Creating new proposal')}>
          <FileText className="h-4 w-4 mr-2" />
          Create Proposal
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Phone className="h-4 w-4 mr-2" />
          Log Call
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => toast.success('Lead marked as won!')}>
          <Check className="h-4 w-4 mr-2" />
          Mark as Won
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast.success('Lead marked as lost!')}>
          <X className="h-4 w-4 mr-2" />
          Mark as Lost
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LeadRowActions;
