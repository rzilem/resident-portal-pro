
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import InvoiceStatusBadge from './InvoiceStatusBadge';
import { Invoice } from '@/components/settings/associations/types';

interface InvoiceTableRowProps {
  invoice: Invoice;
}

const InvoiceTableRow: React.FC<InvoiceTableRowProps> = ({ invoice }) => {
  return (
    <TableRow key={invoice.id}>
      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
      <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
      <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
      <TableCell>
        {invoice.recipientType === 'resident' ? 'Resident' : 'Vendor'}-{invoice.recipientId}
      </TableCell>
      <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
      <TableCell><InvoiceStatusBadge status={invoice.status} /></TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm">View</Button>
          {invoice.status === 'draft' && (
            <Button variant="outline" size="sm">Send</Button>
          )}
          {invoice.status === 'sent' && (
            <Button variant="outline" size="sm">Remind</Button>
          )}
          {invoice.status === 'overdue' && (
            <Button variant="outline" size="sm">Send Reminder</Button>
          )}
          {invoice.status === 'paid' && (
            <Button variant="outline" size="sm">Print Receipt</Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default InvoiceTableRow;
