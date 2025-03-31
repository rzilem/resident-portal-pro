
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { sampleReportDataService } from '@/services/SampleReportDataService';

interface BillingReportProps {
  timeRange: string;
  association: string;
  reportType: 'admin-billing' | 'billing-report';
}

const BillingReport = ({ timeRange, association, reportType }: BillingReportProps) => {
  const [reportData, setReportData] = useState<any>(null);
  
  useEffect(() => {
    // Get sample data from our service
    const data = sampleReportDataService.getFinancialData(reportType, association);
    setReportData(data);
  }, [association, timeRange, reportType]);
  
  if (!reportData) {
    return <div className="animate-pulse p-6 text-center">Loading billing data...</div>;
  }

  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Calculate totals
  const totalBilled = reportData.invoices.reduce((sum: number, invoice: any) => sum + invoice.amount, 0);
  const totalPaid = reportData.invoices.filter((invoice: any) => invoice.status === 'Paid')
    .reduce((sum: number, invoice: any) => sum + invoice.amount, 0);
  const totalOutstanding = totalBilled - totalPaid;

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
          {reportData.invoices.map((invoice: any) => (
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
            <p className="text-xl font-bold mt-1">{formatCurrency(totalBilled)}</p>
          </div>
          <div className="bg-card p-3 rounded-md border">
            <p className="text-sm text-muted-foreground">Paid</p>
            <p className="text-xl font-bold mt-1 text-green-600">{formatCurrency(totalPaid)}</p>
          </div>
          <div className="bg-card p-3 rounded-md border">
            <p className="text-sm text-muted-foreground">Outstanding</p>
            <p className="text-xl font-bold mt-1 text-amber-600">{formatCurrency(totalOutstanding)}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingReport;
