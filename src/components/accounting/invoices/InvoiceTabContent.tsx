
import React from 'react';
import { Table, TableBody, TableCaption } from "@/components/ui/table";
import InvoiceTableHeader from './InvoiceTableHeader';
import InvoiceTableRow from './InvoiceTableRow';
import { Invoice } from '@/components/settings/associations/types';

interface InvoiceTabContentProps {
  invoices: Invoice[];
  status?: string;
  showCaption?: boolean;
}

const InvoiceTabContent: React.FC<InvoiceTabContentProps> = ({ 
  invoices, 
  status, 
  showCaption = false 
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
        <InvoiceTableHeader />
        <TableBody>
          {filteredInvoices.map(invoice => (
            <InvoiceTableRow key={invoice.id} invoice={invoice} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceTabContent;
