
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import InvoiceStatusBadge from './InvoiceStatusBadge';
import { Invoice } from '@/components/settings/associations/types';
import { InvoiceColumn } from './InvoiceColumnsSelector';
import { Eye, MoreHorizontal, FileText, CreditCard, Trash2, Download } from 'lucide-react';

interface InvoiceTableRowProps {
  invoice: Invoice;
  columns: InvoiceColumn[];
  onAction?: (action: string, invoiceId: string) => void;
}

const InvoiceTableRow: React.FC<InvoiceTableRowProps> = ({ 
  invoice, 
  columns,
  onAction
}) => {
  const visibleColumns = columns.filter(col => col.checked);
  
  const handleAction = (action: string) => {
    if (onAction) {
      onAction(action, invoice.id);
    }
  };
  
  const renderCellContent = (columnId: string) => {
    switch (columnId) {
      case 'invoiceNumber':
        return <span className="font-medium">{invoice.invoiceNumber}</span>;
      case 'date':
        return new Date(invoice.date).toLocaleDateString();
      case 'dueDate':
        return new Date(invoice.dueDate).toLocaleDateString();
      case 'vendor':
        return invoice.vendorName || 'N/A';
      case 'association':
        return invoice.associationName || 'N/A';
      case 'amount':
        return `$${invoice.amount.toFixed(2)}`;
      case 'status':
        return <InvoiceStatusBadge status={invoice.status} />;
      case 'recipient':
        return `${invoice.recipientType === 'resident' ? 'Resident' : 'Vendor'}-${invoice.recipientId}`;
      case 'category':
        return invoice.items?.[0]?.category || 'Uncategorized';
      case 'createdAt':
        return new Date(invoice.createdAt).toLocaleDateString();
      default:
        return '';
    }
  };
  
  return (
    <TableRow key={invoice.id} className="hover:bg-muted/30">
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
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => handleAction('view')}
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleAction('view')}>
                <Eye className="h-4 w-4 mr-2" /> View Details
              </DropdownMenuItem>
              
              {invoice.status === 'draft' && (
                <DropdownMenuItem onClick={() => handleAction('edit')}>
                  <FileText className="h-4 w-4 mr-2" /> Edit Invoice
                </DropdownMenuItem>
              )}
              
              {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                <DropdownMenuItem onClick={() => handleAction('pay')}>
                  <CreditCard className="h-4 w-4 mr-2" /> Process Payment
                </DropdownMenuItem>
              )}
              
              {invoice.status === 'paid' && (
                <DropdownMenuItem onClick={() => handleAction('receipt')}>
                  <Download className="h-4 w-4 mr-2" /> Download Receipt
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem 
                onClick={() => handleAction('delete')}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default InvoiceTableRow;
