import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Building, FileText } from 'lucide-react';
import { Association } from '@/types/association';

interface ReportFiltersProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
  association: string;
  setAssociation: (value: string) => void;
  associations: Association[];
  reportType: 'financial' | 'property' | 'resident';
  selectedReport: string;
  setSelectedReport: (value: string) => void;
}

const ReportFilters = ({ 
  timeRange, 
  setTimeRange, 
  association, 
  setAssociation,
  associations,
  reportType,
  selectedReport,
  setSelectedReport
}: ReportFiltersProps) => {
  
  useEffect(() => {
    console.log("ReportFilters: association changed to", association);
  }, [association]);
  
  const reportOptions = {
    financial: [
      { value: 'income-expense', label: 'Income vs Expenses' },
      { value: 'cash-flow', label: 'Cash Flow Report' },
      { value: 'admin-billing', label: 'Admin Billing Report' },
      { value: 'bank-balances', label: 'Bank Account Balances' },
      { value: 'billing-report', label: 'Billing Report' },
      { value: 'cash-forecast', label: 'Cash Forecast Report' },
      { value: 'financial-summary', label: 'Financial Summary' },
      { value: 'bank-unreconciled', label: 'Daily Bank Unreconciled Items' },
      { value: 'invoices-list', label: 'Full Invoice List (Last 90 Days)' },
      { value: 'gl-entry', label: 'GL Entry Report' },
      { value: 'owners-credit', label: 'Merged Owners w/ Credit' },
      { value: 'service-contract', label: 'Service Contract w/ No Activity' }
    ],
    property: [
      { value: 'overview', label: 'Property Overview' },
      { value: 'arc-report', label: 'ARC Report' },
      { value: 'association-list', label: 'Association List' },
      { value: 'collections', label: 'Collections Report' },
      { value: 'homeowner-charge', label: 'Homeowner Charge Percentages' },
      { value: 'charge-tags', label: 'Homeowner Charge Tags' },
      { value: 'other-tags', label: 'Homeowner Other Tags' },
      { value: 'board-invoices', label: 'Open Board Invoices Report' },
      { value: 'open-invoices', label: 'Open Invoices Report' },
      { value: 'owner-transfer', label: 'Owner Transfer Report' },
      { value: 'paid-invoices', label: 'Paid Invoices By Service Provider' },
      { value: 'violations', label: 'Violations Report' },
      { value: 'work-order', label: 'Work Order Summary' }
    ],
    resident: [
      { value: 'resident-overview', label: 'Resident Overview' },
      { value: 'homeowner-invoice', label: 'Homeowner Invoice' },
      { value: 'statement-charge-summary', label: 'Statement (Charge Summary)' },
      { value: 'statement-last-2-months', label: 'Statement (Last 2 Months)' },
      { value: 'statement-last-month', label: 'Statement (Last Month)' },
      { value: 'statement-last-zero-balance', label: 'Statement (Last Zero Balance)' },
      { value: 'statement-ytd', label: 'Statement (YTD)' },
      { value: 'statement-last-2-months-no-future', label: 'Statement Last 2 Months (No Future Charges)' },
      { value: 'statement-last-month-no-future', label: 'Statement Last Month (No Future Charges)' },
      { value: 'statement-ytd-no-future', label: 'Statement YTD (No Future Charges)' },
      { value: 'mailing-labels', label: 'All Address Mailing Labels' },
      { value: 'current-addresses', label: 'All Addresses (Current Resident) Export' },
      { value: 'all-addresses', label: 'All Addresses Export' },
      { value: 'board-members', label: 'All Board Members' },
      { value: 'contact-info', label: 'Homeowner Contact Information' },
      { value: 'homeowner-labels', label: 'Homeowner Mailing Labels' },
      { value: 'recurring-credit', label: 'Homeowner Recurring Credit Export' },
      { value: 'rent-export', label: 'Homeowner Rent Export' },
      { value: 'transaction-history', label: 'Homeowner Transaction History' },
      { value: 'transaction-by-charge', label: 'Homeowner Transaction History By Charge' },
      { value: 'mailing-addresses', label: 'Mailing Addresses Export' },
      { value: 'meeting-signin', label: 'Meeting Sign-in' },
      { value: 'meeting-consolidated', label: 'Meeting Sign-In (Consolidated)' },
      { value: 'owner-changes', label: 'Owner Changes Summary Report' },
      { value: 'owner-violation', label: 'Owner Violation Report' }
    ]
  };

  const currentReports = reportOptions[reportType] || [];

  return (
    <Card>
      <CardContent className="p-4 flex flex-wrap gap-4">
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium">Report Type</span>
          <Select value={selectedReport} onValueChange={setSelectedReport}>
            <SelectTrigger className="w-[220px]">
              <FileText className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currentReports.map((report) => (
                <SelectItem key={report.value} value={report.value}>
                  {report.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium">Time Period</span>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium">Association</span>
          <Select value={association} onValueChange={(value) => {
            console.log("Setting association to:", value);
            setAssociation(value);
          }}>
            <SelectTrigger className="w-[200px]">
              <Building className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Associations</SelectItem>
              {associations.map((assoc) => (
                <SelectItem key={assoc.id} value={assoc.id}>
                  {assoc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportFilters;
