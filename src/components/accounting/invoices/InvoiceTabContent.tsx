
import React from 'react';
import { Table, TableBody, TableCaption } from "@/components/ui/table";
import InvoiceTableHeader from './InvoiceTableHeader';
import InvoiceTableRow from './InvoiceTableRow';
import { Invoice } from '@/components/settings/associations/types';
import { InvoiceColumn } from './InvoiceColumnsSelector';
import { Skeleton } from "@/components/ui/skeleton";

interface InvoiceTabContentProps {
  invoices: Invoice[];
  status?: string;
  showCaption?: boolean;
  columns: InvoiceColumn[];
  onAction?: (action: string, invoiceId: string) => void;
  loading?: boolean;
}

const InvoiceTabContent: React.FC<InvoiceTabContentProps> = ({ 
  invoices, 
  status, 
  showCaption = false,
  columns,
  onAction,
  loading = false
}) => {
  // Filter invoices by status if provided
  const filteredInvoices = status 
    ? invoices.filter(invoice => invoice.status === status)
    : invoices;
  
  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <InvoiceTableHeader columns={columns} />
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                {columns.filter(col => col.checked).map((column, colIndex) => (
                  <td key={colIndex} className="p-2">
                    <Skeleton className="h-6 w-full" />
                  </td>
                ))}
                <td className="p-2">
                  <Skeleton className="h-6 w-20 ml-auto" />
                </td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        {showCaption && status && (
          <TableCaption>
            {filteredInvoices.length === 0 
              ? `No ${status} invoices found`
              : `Showing ${filteredInvoices.length} invoice${filteredInvoices.length === 1 ? '' : 's'} with '${status.charAt(0).toUpperCase() + status.slice(1)}' status`
            }
          </TableCaption>
        )}
        <InvoiceTableHeader columns={columns} />
        <TableBody>
          {filteredInvoices.length === 0 ? (
            <tr>
              <td colSpan={columns.filter(col => col.checked).length + 1} className="py-6 text-center text-muted-foreground">
                No invoices found. Try adjusting your filters.
              </td>
            </tr>
          ) : (
            filteredInvoices.map(invoice => (
              <InvoiceTableRow 
                key={invoice.id} 
                invoice={invoice} 
                columns={columns} 
                onAction={onAction}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceTabContent;
