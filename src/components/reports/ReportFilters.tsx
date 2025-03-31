
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Building, FileText } from 'lucide-react';
import { Association } from '@/types/association';
import { Badge } from '@/components/ui/badge';

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
  // Log when association changes to debug
  useEffect(() => {
    console.log("ReportFilters: association changed to", association);
  }, [association]);
  
  // Define report categories with colors
  const categoryColors = {
    billing: "bg-blue-100 text-blue-800",
    balance: "bg-purple-100 text-purple-800",
    banking: "bg-green-100 text-green-800",
    budget: "bg-amber-100 text-amber-800",
    general: "bg-slate-100 text-slate-800",
    property: "bg-emerald-100 text-emerald-800",
    resident: "bg-rose-100 text-rose-800",
    document: "bg-indigo-100 text-indigo-800",
    violations: "bg-red-100 text-red-800",
    maintenance: "bg-cyan-100 text-cyan-800",
    statement: "bg-orange-100 text-orange-800",
    homeowner: "bg-pink-100 text-pink-800",
    meeting: "bg-violet-100 text-violet-800"
  };
  
  const reportOptions = {
    financial: [
      { value: 'admin-billing', label: 'Admin Billing Report', category: 'billing' },
      { value: 'balance-sheet-consolidated', label: 'Balance Sheet - Consolidated', category: 'balance' },
      { value: 'balance-sheet-groups', label: 'Balance Sheet - Groups Only', category: 'balance' },
      { value: 'balance-sheet-fund', label: 'Balance Sheet by Fund', category: 'balance' },
      { value: 'balance-sheet-monthly', label: 'Balance Sheet Monthly Comparison', category: 'balance' },
      { value: 'balance-sheet-codes', label: 'Balance Sheet Monthly Comparison (w/ Codes)', category: 'balance' },
      { value: 'balance-sheet-breakout', label: 'Balance Sheet W/ Breakout', category: 'balance' },
      { value: 'bank-balances', label: 'Bank Account Balances', category: 'banking' },
      { value: 'bank-reconciliation', label: 'Bank Reconciliation', category: 'banking' },
      { value: 'bank-reconciliation-by-bank', label: 'Bank Reconciliation By Bank', category: 'banking' },
      { value: 'bank-register', label: 'Bank Register', category: 'banking' },
      { value: 'bank-unreconciled', label: 'Daily Bank Unreconciled Items', category: 'banking' },
      { value: 'billing-report', label: 'Billing Report', category: 'billing' },
      { value: 'budget', label: 'Budget', category: 'budget' },
      { value: 'budget-spread', label: 'Budget Spread Report', category: 'budget' },
      { value: 'budget-status-year', label: 'Budget Status By Year Export', category: 'budget' },
      { value: 'budget-per-unit-annual', label: 'Budget w/ Per Unit Cost (Annual)', category: 'budget' },
      { value: 'budget-per-unit-monthly', label: 'Budget w/ Per Unit Cost (Monthly)', category: 'budget' },
      { value: 'budget-per-unit-quarterly', label: 'Budget w/ Per Unit Cost (Quarterly)', category: 'budget' },
      { value: 'budget-per-unit-semi', label: 'Budget w/ Per Unit Cost (Semi-Annual)', category: 'budget' },
      { value: 'cash-flow', label: 'Cash Flow Report', category: 'general' },
      { value: 'cash-forecast', label: 'Cash Forecast Report', category: 'general' },
      { value: 'financial-summary', label: 'Financial Summary', category: 'general' },
      { value: 'gl-entry', label: 'GL Entry Report', category: 'general' },
      { value: 'income-expense', label: 'Income vs Expenses', category: 'general' },
      { value: 'invoices-list', label: 'Full Invoice List (Last 90 Days)', category: 'general' },
      { value: 'owners-credit', label: 'Merged Owners w/ Credit', category: 'general' },
      { value: 'service-contract', label: 'Service Contract w/ No Activity', category: 'general' }
    ],
    property: [
      { value: 'arc-report', label: 'ARC Report', category: 'property' },
      { value: 'association-list', label: 'Association List', category: 'property' },
      { value: 'collections', label: 'Collections Report', category: 'property' },
      { value: 'homeowner-charge', label: 'Homeowner Charge Percentages', category: 'property' },
      { value: 'charge-tags', label: 'Homeowner Charge Tags', category: 'property' },
      { value: 'other-tags', label: 'Homeowner Other Tags', category: 'property' },
      { value: 'board-invoices', label: 'Open Board Invoices Report', category: 'property' },
      { value: 'open-invoices', label: 'Open Invoices Report', category: 'property' },
      { value: 'owner-transfer', label: 'Owner Transfer Report', category: 'property' },
      { value: 'overview', label: 'Property Overview', category: 'property' },
      { value: 'paid-invoices', label: 'Paid Invoices By Service Provider', category: 'property' },
      { value: 'violations', label: 'Violations Report', category: 'violations' },
      { value: 'work-order', label: 'Work Order Summary', category: 'maintenance' }
    ],
    resident: [
      { value: 'all-addresses', label: 'All Addresses Export', category: 'resident' },
      { value: 'current-addresses', label: 'All Addresses (Current Resident) Export', category: 'resident' },
      { value: 'board-members', label: 'All Board Members', category: 'resident' },
      { value: 'mailing-labels', label: 'All Address Mailing Labels', category: 'document' },
      { value: 'contact-info', label: 'Homeowner Contact Information', category: 'homeowner' },
      { value: 'homeowner-invoice', label: 'Homeowner Invoice', category: 'homeowner' },
      { value: 'homeowner-labels', label: 'Homeowner Mailing Labels', category: 'homeowner' },
      { value: 'owner-violation', label: 'Owner Violation Report', category: 'violations' },
      { value: 'owner-changes', label: 'Owner Changes Summary Report', category: 'homeowner' },
      { value: 'recurring-credit', label: 'Homeowner Recurring Credit Export', category: 'homeowner' },
      { value: 'rent-export', label: 'Homeowner Rent Export', category: 'homeowner' },
      { value: 'transaction-history', label: 'Homeowner Transaction History', category: 'homeowner' },
      { value: 'transaction-by-charge', label: 'Homeowner Transaction History By Charge', category: 'homeowner' },
      { value: 'mailing-addresses', label: 'Mailing Addresses Export', category: 'document' },
      { value: 'meeting-signin', label: 'Meeting Sign-in', category: 'meeting' },
      { value: 'meeting-consolidated', label: 'Meeting Sign-In (Consolidated)', category: 'meeting' },
      { value: 'resident-overview', label: 'Resident Overview', category: 'resident' },
      { value: 'statement-charge-summary', label: 'Statement (Charge Summary)', category: 'statement' },
      { value: 'statement-last-2-months', label: 'Statement (Last 2 Months)', category: 'statement' },
      { value: 'statement-last-month', label: 'Statement (Last Month)', category: 'statement' },
      { value: 'statement-last-zero-balance', label: 'Statement (Last Zero Balance)', category: 'statement' },
      { value: 'statement-ytd', label: 'Statement (YTD)', category: 'statement' },
      { value: 'statement-last-2-months-no-future', label: 'Statement Last 2 Months (No Future Charges)', category: 'statement' },
      { value: 'statement-last-month-no-future', label: 'Statement Last Month (No Future Charges)', category: 'statement' },
      { value: 'statement-ytd-no-future', label: 'Statement YTD (No Future Charges)', category: 'statement' }
    ]
  };

  // Sort the report options alphabetically within each category
  const sortedReportOptions = {
    financial: [...reportOptions.financial].sort((a, b) => a.label.localeCompare(b.label)),
    property: [...reportOptions.property].sort((a, b) => a.label.localeCompare(b.label)),
    resident: [...reportOptions.resident].sort((a, b) => a.label.localeCompare(b.label))
  };

  const currentReports = sortedReportOptions[reportType] || [];

  // Group reports by category
  const reportsByCategory = currentReports.reduce((acc, report) => {
    if (!acc[report.category]) {
      acc[report.category] = [];
    }
    acc[report.category].push(report);
    return acc;
  }, {} as Record<string, typeof currentReports>);

  // Get all categories in the current report type
  const categories = Object.keys(reportsByCategory).sort();

  return (
    <Card>
      <CardContent className="p-4 flex flex-wrap gap-4">
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium">Report Type</span>
          <Select value={selectedReport || "select_report"} onValueChange={setSelectedReport}>
            <SelectTrigger className="w-[280px]">
              <FileText className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select a report" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectItem value="select_report" disabled>Select a report</SelectItem>
              
              {categories.map((category) => (
                <React.Fragment key={category}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase mt-2 first:mt-0">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </div>
                  {reportsByCategory[category].map((report) => (
                    <SelectItem key={report.value} value={report.value} className="flex items-center">
                      <div className="flex items-center gap-2">
                        <span>{report.label}</span>
                        <Badge className={`text-[10px] py-0 px-1.5 ${categoryColors[report.category as keyof typeof categoryColors]}`}>
                          {category}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </React.Fragment>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium">Time Period</span>
          <Select value={timeRange || "month"} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select time period" />
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
          <Select 
            value={association || "all"} 
            onValueChange={(value) => {
              console.log("Setting association to:", value);
              setAssociation(value);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <Building className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select association" />
            </SelectTrigger>
            <SelectContent className="z-50">
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
