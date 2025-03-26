
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  CreditCard
} from "lucide-react";

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'void' | 'partially_paid';

interface InvoiceStatusBadgeProps {
  status: string;
}

const InvoiceStatusBadge: React.FC<InvoiceStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'draft':
      return (
        <Badge variant="outline" className="bg-slate-100 text-slate-700 flex items-center gap-1 border-slate-200">
          <Clock size={14} /> Draft
        </Badge>
      );
    case 'sent':
      return (
        <Badge className="bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center gap-1 border-blue-200">
          <Send size={14} /> Sent
        </Badge>
      );
    case 'paid':
      return (
        <Badge className="bg-green-100 hover:bg-green-200 text-green-700 flex items-center gap-1 border-green-200">
          <CheckCircle size={14} /> Paid
        </Badge>
      );
    case 'overdue':
      return (
        <Badge className="bg-red-100 hover:bg-red-200 text-red-700 flex items-center gap-1 border-red-200">
          <AlertCircle size={14} /> Overdue
        </Badge>
      );
    case 'void':
      return (
        <Badge variant="outline" className="text-slate-700 flex items-center gap-1 border-slate-200">
          <XCircle size={14} /> Void
        </Badge>
      );
    case 'partially_paid':
      return (
        <Badge className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 flex items-center gap-1 border-yellow-200">
          <CreditCard size={14} /> Partially Paid
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

export default InvoiceStatusBadge;
