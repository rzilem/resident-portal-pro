import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, Download, FileText, Calendar, Info } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate, formatCurrency } from './utils/formatters';

interface HomeownerStatementReportProps {
  timeRange: string;
  association: string;
  selectedReport: string;
}

const HomeownerStatementReport = ({ timeRange, association, selectedReport }: HomeownerStatementReportProps) => {
  // Helper function to get title based on report type
  const getReportTitle = () => {
    switch (selectedReport) {
      case 'homeowner-invoice':
        return 'Homeowner Invoice';
      case 'statement-charge-summary':
        return 'Statement (Charge Summary)';
      case 'statement-last-2-months':
        return 'Statement (Last 2 Months)';
      case 'statement-last-month':
        return 'Statement (Last Month)';
      case 'statement-last-zero-balance':
        return 'Statement (Last Zero Balance)';
      case 'statement-ytd':
        return 'Statement (YTD)';
      case 'statement-last-2-months-no-future':
        return 'Statement Last 2 Months (No Future Charges)';
      case 'statement-last-month-no-future':
        return 'Statement Last Month (No Future Charges)';
      case 'statement-ytd-no-future':
        return 'Statement YTD (No Future Charges)';
      default:
        return 'Homeowner Statement';
    }
  };
  
  // Sample statement data by association
  const allStatementEntries = {
    'all': [
      { date: '2023-05-01', description: 'Monthly HOA Fee', debit: 250, credit: 0, balance: 250, associationId: 'all' },
      { date: '2023-05-15', description: 'Payment Received', debit: 0, credit: 250, balance: 0, associationId: 'all' },
      { date: '2023-06-01', description: 'Monthly HOA Fee', debit: 250, credit: 0, balance: 250, associationId: 'all' },
      { date: '2023-06-10', description: 'Late Fee', debit: 25, credit: 0, balance: 275, associationId: 'all' },
      { date: '2023-06-20', description: 'Payment Received', debit: 0, credit: 275, balance: 0, associationId: 'all' },
      { date: '2023-07-01', description: 'Monthly HOA Fee', debit: 250, credit: 0, balance: 250, associationId: 'all' },
      { date: '2023-07-15', description: 'Special Assessment', debit: 500, credit: 0, balance: 750, associationId: 'all' },
      { date: '2023-07-18', description: 'Payment Received', debit: 0, credit: 250, balance: 500, associationId: 'all' },
    ],
    '1': [
      { date: '2023-05-01', description: 'Riverside HOA Fee', debit: 300, credit: 0, balance: 300, associationId: '1' },
      { date: '2023-05-18', description: 'Payment Received', debit: 0, credit: 300, balance: 0, associationId: '1' },
      { date: '2023-06-01', description: 'Riverside HOA Fee', debit: 300, credit: 0, balance: 300, associationId: '1' },
      { date: '2023-06-20', description: 'Payment Received', debit: 0, credit: 300, balance: 0, associationId: '1' },
      { date: '2023-07-01', description: 'Riverside HOA Fee', debit: 300, credit: 0, balance: 300, associationId: '1' },
      { date: '2023-07-15', description: 'Pool Assessment', debit: 450, credit: 0, balance: 750, associationId: '1' },
    ],
    '2': [
      { date: '2023-05-01', description: 'Oakwood Condos Fee', debit: 400, credit: 0, balance: 400, associationId: '2' },
      { date: '2023-05-14', description: 'Payment Received', debit: 0, credit: 400, balance: 0, associationId: '2' },
      { date: '2023-06-01', description: 'Oakwood Condos Fee', debit: 400, credit: 0, balance: 400, associationId: '2' },
      { date: '2023-06-15', description: 'Payment Received', debit: 0, credit: 400, balance: 0, associationId: '2' },
      { date: '2023-07-01', description: 'Oakwood Condos Fee', debit: 400, credit: 0, balance: 400, associationId: '2' },
      { date: '2023-07-12', description: 'Elevator Assessment', debit: 350, credit: 0, balance: 750, associationId: '2' },
    ],
    '3': [
      { date: '2023-05-01', description: 'Pinecrest Comunity Fee', debit: 275, credit: 0, balance: 275, associationId: '3' },
      { date: '2023-05-20', description: 'Payment Received', debit: 0, credit: 275, balance: 0, associationId: '3' },
      { date: '2023-06-01', description: 'Pinecrest Comunity Fee', debit: 275, credit: 0, balance: 275, associationId: '3' },
      { date: '2023-06-18', description: 'Payment Received', debit: 0, credit: 275, balance: 0, associationId: '3' },
      { date: '2023-07-01', description: 'Pinecrest Comunity Fee', debit: 275, credit: 0, balance: 275, associationId: '3' },
      { date: '2023-07-10', description: 'Playground Assessment', debit: 300, credit: 0, balance: 575, associationId: '3' },
    ],
  };

  const [statementEntries, setStatementEntries] = useState(allStatementEntries.all);

  // Filter statement entries when association changes
  useEffect(() => {
    console.log("HomeownerStatementReport: filtering by association", association);
    if (association === 'all') {
      setStatementEntries(allStatementEntries.all);
    } else if (allStatementEntries[association]) {
      setStatementEntries(allStatementEntries[association]);
    } else {
      // Fallback to default data if no matching association is found
      setStatementEntries(allStatementEntries.all);
    }
  }, [association]);

  // Homeowner info - adjust based on association
  const [homeownerInfo, setHomeownerInfo] = useState({
    name: 'John Smith',
    propertyAddress: '123 Main Street, Anytown, USA 12345',
    accountNumber: 'HOA-12345',
    statementDate: new Date().toLocaleDateString(),
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    totalDue: 500,
  });

  // Update homeowner info when association changes
  useEffect(() => {
    if (association === '1') {
      setHomeownerInfo({
        name: 'Robert Johnson',
        propertyAddress: '456 Riverside Dr, Rivertown, USA 23456',
        accountNumber: 'RIV-54321',
        statementDate: new Date().toLocaleDateString(),
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        totalDue: 750,
      });
    } else if (association === '2') {
      setHomeownerInfo({
        name: 'Jane Wilson',
        propertyAddress: '789 Oak Ave, Oakville, USA 34567',
        accountNumber: 'OAK-67890',
        statementDate: new Date().toLocaleDateString(),
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        totalDue: 750,
      });
    } else if (association === '3') {
      setHomeownerInfo({
        name: 'Sarah Miller',
        propertyAddress: '101 Pine St, Pineville, USA 45678',
        accountNumber: 'PIN-10112',
        statementDate: new Date().toLocaleDateString(),
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        totalDue: 575,
      });
    } else {
      // Default info
      setHomeownerInfo({
        name: 'John Smith',
        propertyAddress: '123 Main Street, Anytown, USA 12345',
        accountNumber: 'HOA-12345',
        statementDate: new Date().toLocaleDateString(),
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        totalDue: 500,
      });
    }
  }, [association]);

  const actionsForReport = () => {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          PDF
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <FileText className="h-4 w-4" />
          Print
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="px-2">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>About {getReportTitle()}</DialogTitle>
              <DialogDescription>
                This report shows detailed transaction history and balance information for the selected homeowner.
                {selectedReport.includes('no-future') && ' Future charges are excluded from this statement.'}
              </DialogDescription>
            </DialogHeader>
            <div className="text-sm">
              <p className="mb-2">Report Features:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>View transaction history with running balance</li>
                <li>See payment history and dues information</li>
                <li>Export to PDF for record keeping</li>
                <li>Print for distribution to homeowners</li>
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          {getReportTitle()}
        </h3>
        {actionsForReport()}
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Account Information</h4>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Homeowner:</span> {homeownerInfo.name}</p>
                <p><span className="font-medium">Account #:</span> {homeownerInfo.accountNumber}</p>
                <p><span className="font-medium">Property:</span> {homeownerInfo.propertyAddress}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Statement Summary</h4>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Statement Date:</span> {homeownerInfo.statementDate}</p>
                <p><span className="font-medium">Due Date:</span> {homeownerInfo.dueDate}</p>
                <p><span className="font-medium text-red-600">Total Due:</span> {formatCurrency(homeownerInfo.totalDue)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-4">
        <div className="bg-muted/40 p-3 rounded-md flex items-center gap-2 mb-4">
          <Info className="h-4 w-4 text-blue-500" />
          <span className="text-sm">
            This statement shows all transactions from {selectedReport.includes('month') 
              ? 'the last month' 
              : selectedReport.includes('2-months') 
                ? 'the last 2 months' 
                : selectedReport.includes('ytd') 
                  ? 'the beginning of the year' 
                  : 'the last zero balance date'}.
          </span>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Debit</TableHead>
            <TableHead className="text-right">Credit</TableHead>
            <TableHead className="text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statementEntries.map((entry, index) => (
            <TableRow key={index}>
              <TableCell>{formatDate(entry.date)}</TableCell>
              <TableCell>{entry.description}</TableCell>
              <TableCell className="text-right">{entry.debit > 0 ? formatCurrency(entry.debit) : '-'}</TableCell>
              <TableCell className="text-right">{entry.credit > 0 ? formatCurrency(entry.credit) : '-'}</TableCell>
              <TableCell className="text-right font-medium">{formatCurrency(entry.balance)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Payment Instructions</h4>
                <p className="text-xs text-muted-foreground">
                  Please include your account number on all payments.
                  Make checks payable to "Homeowners Association".
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Payment Options</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Online: www.hoa-payments.com</p>
                  <p>• Phone: (555) 123-4567</p>
                  <p>• Mail: HOA Office, 456 Center St, Anytown, USA 12345</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Total Due</h4>
                <div className="bg-red-50 p-3 rounded-md">
                  <span className="text-2xl font-bold text-red-600">{formatCurrency(homeownerInfo.totalDue)}</span>
                  <p className="text-xs text-red-600 mt-1">Due by {homeownerInfo.dueDate}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeownerStatementReport;
