
import React from 'react';
import { Table, TableBody, TableCaption } from "@/components/ui/table";
import InvoiceTableHeader from './InvoiceTableHeader';
import InvoiceTableRow from './InvoiceTableRow';
import { Invoice } from '@/components/settings/associations/types';
import { InvoiceColumn } from './InvoiceColumnsSelector';

interface InvoiceTabContentProps {
  invoices: Invoice[];
  status?: string;
  showCaption?: boolean;
  columns: InvoiceColumn[];
}

const InvoiceTabContent: React.FC<InvoiceTabContentProps> = ({ 
  invoices, 
  status, 
  showCaption = false,
  columns
}) => {
  // Filter invoices by status if provided
  const filteredInvoices = status 
    ? invoices.filter(invoice => invoice.status === status)
    : invoices;
  
  return (
    <div className="rounded-md border">
      <Table>
        {showCaption && status && (
          <TableCaption>Only showing invoices with '{status.charAt(0).toUpperCase() + status.slice(1)}' status</TableCaption>
        )}
        <InvoiceTableHeader columns={columns} />
        <TableBody>
          {filteredInvoices.map(invoice => (
            <InvoiceTableRow key={invoice.id} invoice={invoice} columns={columns} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceTabContent;
