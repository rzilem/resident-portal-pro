
import React from 'react';
import { Button } from '@/components/ui/button';
import { Info, FileSpreadsheet } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Association } from '@/types/association';

interface ReportsListProps {
  type: 'financial' | 'property' | 'resident';
  onRunReport: (report: string) => void;
  selectedAssociation: Association | null;
}

const ReportsList: React.FC<ReportsListProps> = ({ type, onRunReport, selectedAssociation }) => {
  const getReportsList = () => {
    switch (type) {
      case 'financial':
        return [
          { value: 'admin-billing', label: 'Admin Billing Report' },
          { value: 'financial-summary', label: 'Financial Summary' },
          { value: 'bank-balances', label: 'Bank Account Balances' },
          { value: 'billing-report', label: 'Billing Report' },
          { value: 'cash-forecast', label: 'Cash Forecast Report' },
          { value: 'bank-unreconciled', label: 'Daily Bank Unreconciled Items' },
          { value: 'invoices-list', label: 'Full Invoice List (Last 90 Days)' },
          { value: 'gl-entry', label: 'GL Entry Report' },
          { value: 'owners-credit', label: 'Merged Owners w/ Credit' },
          { value: 'service-contract', label: 'Service Contract w/ No Activity' },
          { value: 'balance-sheet-consolidated', label: 'Balance Sheet - Consolidated' },
          { value: 'balance-sheet-groups', label: 'Balance Sheet - Groups Only' },
          { value: 'balance-sheet-fund', label: 'Balance Sheet by Fund' },
          { value: 'balance-sheet-monthly', label: 'Balance Sheet Monthly Comparison' },
          { value: 'balance-sheet-codes', label: 'Balance Sheet Monthly Comparison (w/ Codes)' },
          { value: 'balance-sheet-breakout', label: 'Balance Sheet W/ Breakout' },
          { value: 'bank-reconciliation', label: 'Bank Reconciliation' },
          { value: 'bank-reconciliation-by-bank', label: 'Bank Reconciliation By Bank' },
          { value: 'bank-register', label: 'Bank Register' },
          { value: 'budget', label: 'Budget' },
          { value: 'budget-spread', label: 'Budget Spread Report' },
          { value: 'budget-status-year', label: 'Budget Status By Year Export' },
          { value: 'budget-per-unit-annual', label: 'Budget w/ Per Unit Cost (Annual)' },
          { value: 'budget-per-unit-monthly', label: 'Budget w/ Per Unit Cost (Monthly)' },
          { value: 'budget-per-unit-quarterly', label: 'Budget w/ Per Unit Cost (Quarterly)' },
          { value: 'budget-per-unit-semi', label: 'Budget w/ Per Unit Cost (Semi-Annual)' }
        ];
      case 'property':
        return [
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
        ];
      case 'resident':
        return [
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
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-2">
      {getReportsList().map((report) => (
        <div key={report.value} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/5">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
            <span>{report.label}</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    {`This report provides ${report.label.toLowerCase()} information for ${selectedAssociation?.name || 'all associations'}.`}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onRunReport(report.value)}
            >
              Run
            </Button>
            <Button size="sm" variant="outline">
              New Window
            </Button>
            <Button size="sm" variant="outline">
              PDF
            </Button>
            {['bank-balances', 'invoices-list', 'association-list', 'budget', 'budget-spread', 'budget-status-year', 'budget-per-unit-annual', 'budget-per-unit-monthly', 'budget-per-unit-quarterly', 'budget-per-unit-semi'].includes(report.value) && (
              <Button size="sm" variant="outline">
                Excel
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportsList;
