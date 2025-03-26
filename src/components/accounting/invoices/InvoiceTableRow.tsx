
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import InvoiceStatusBadge from './InvoiceStatusBadge';
import { Invoice } from '@/components/settings/associations/types';
import { InvoiceColumn } from './InvoiceColumnsSelector';

interface InvoiceTableRowProps {
  invoice: Invoice;
  columns: InvoiceColumn[];
}

const InvoiceTableRow: React.FC<InvoiceTableRowProps> = ({ invoice, columns }) => {
  const visibleColumns = columns.filter(col => col.checked);
  
  // Function to render cell content based on column id
  const renderCellContent = (columnId: string) => {
    switch (columnId) {
      case 'invoiceNumber':
        return <span className="font-medium">{invoice.invoiceNumber}</span>;
      case 'date':
        return new Date(invoice.date).toLocaleDateString();
      case 'dueDate':
        return new Date(invoice.dueDate).toLocaleDateString();
      case 'recipient':
        return `${invoice.recipientType === 'resident' ? 'Resident' : 'Vendor'}-${invoice.recipientId}`;
      case 'amount':
        return `$${invoice.amount.toFixed(2)}`;
      case 'status':
        return <InvoiceStatusBadge status={invoice.status} />;
      case 'vendor':
        return invoice.vendorName || (invoice.recipientType === 'vendor' ? invoice.recipientId : 'N/A');
      case 'association':
        return invoice.associationName || 'Default Association';
      case 'category':
        return invoice.items?.[0]?.category || 'Uncategorized';
      case 'createdAt':
        return new Date(invoice.createdAt).toLocaleDateString();
      default:
        return '';
    }
  };
  
  return (
    <TableRow key={invoice.id}>
      {visibleColumns.map(column => (
        <TableCell 
          key={`${invoice.id}-${column.id}`}
          className={column.id === 'amount' ? 'text-right' : ''}
        >
          {renderCellContent(column.id)}
        </TableCell>
      ))}
      
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
