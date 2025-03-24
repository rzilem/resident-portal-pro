
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  XCircle 
} from "lucide-react";

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'void' | 'partially_paid';

interface InvoiceStatusBadgeProps {
  status: string;
}

const InvoiceStatusBadge: React.FC<InvoiceStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'draft':
      return <Badge variant="outline" className="flex items-center gap-1"><Clock size={14} /> Draft</Badge>;
    case 'sent':
      return <Badge className="bg-blue-500 flex items-center gap-1"><Send size={14} /> Sent</Badge>;
    case 'paid':
      return <Badge className="bg-green-500 flex items-center gap-1"><CheckCircle size={14} /> Paid</Badge>;
    case 'overdue':
      return <Badge className="bg-red-500 flex items-center gap-1"><AlertCircle size={14} /> Overdue</Badge>;
    case 'void':
      return <Badge variant="outline" className="flex items-center gap-1"><XCircle size={14} /> Void</Badge>;
    case 'partially_paid':
      return <Badge className="bg-yellow-500 flex items-center gap-1"><Clock size={14} /> Partially Paid</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default InvoiceStatusBadge;
