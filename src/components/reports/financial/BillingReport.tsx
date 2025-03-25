
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface BillingReportProps {
  timeRange: string;
  association: string;
  reportType: 'admin-billing' | 'billing-report';
}

const BillingReport = ({ timeRange, association, reportType }: BillingReportProps) => {
  // Sample data
  const invoiceData = [
    { id: 'INV-2305', date: '2023-05-15', amount: 1250, status: 'Paid', vendor: 'ABC Maintenance' },
    { id: 'INV-2306', date: '2023-05-22', amount: 850, status: 'Paid', vendor: 'City Utilities' },
    { id: 'INV-2307', date: '2023-06-01', amount: 1500, status: 'Pending', vendor: 'Premium Insurance' },
    { id: 'INV-2308', date: '2023-06-10', amount: 750, status: 'Paid', vendor: 'Green Landscaping' },
    { id: 'INV-2309', date: '2023-06-15', amount: 1100, status: 'Overdue', vendor: 'Security Systems Inc' },
    { id: 'INV-2310', date: '2023-06-28', amount: 950, status: 'Pending', vendor: 'ABC Maintenance' },
    { id: 'INV-2311', date: '2023-07-05', amount: 1350, status: 'Paid', vendor: 'Elevator Services' },
    { id: 'INV-2312', date: '2023-07-12', amount: 800, status: 'Pending', vendor: 'City Utilities' },
  ];

  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          {reportType === 'admin-billing' ? 'Admin Billing Report' : 'Billing Report'}
          <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </h3>
        <Button variant="outline" size="sm">
          Download PDF
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Vendor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoiceData.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
              <TableCell>{formatCurrency(invoice.amount)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                  invoice.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {invoice.status}
                </span>
              </TableCell>
              <TableCell>{invoice.vendor}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="mt-6 p-4 bg-muted/50 rounded-md">
        <h4 className="text-base font-medium mb-2">Billing Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card p-3 rounded-md border">
            <p className="text-sm text-muted-foreground">Total Billed</p>
            <p className="text-xl font-bold mt-1">$8,550</p>
          </div>
          <div className="bg-card p-3 rounded-md border">
            <p className="text-sm text-muted-foreground">Paid</p>
            <p className="text-xl font-bold mt-1 text-green-600">$5,100</p>
          </div>
          <div className="bg-card p-3 rounded-md border">
            <p className="text-sm text-muted-foreground">Outstanding</p>
            <p className="text-xl font-bold mt-1 text-amber-600">$3,450</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingReport;
