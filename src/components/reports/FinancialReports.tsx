import React from 'react';
import IncomeExpenseReport from './financial/IncomeExpenseReport';
import CashFlowReport from './financial/CashFlowReport';
import BillingReport from './financial/BillingReport';
import BankBalancesReport from './financial/BankBalancesReport';
import CashForecastReport from './financial/CashForecastReport';

interface FinancialReportsProps {
  timeRange: string;
  association: string;
  selectedReport: string;
}

const FinancialReports = ({ timeRange, association, selectedReport }: FinancialReportsProps) => {
  // Render different reports based on selectedReport value
  const renderReportContent = () => {
    switch (selectedReport) {
      case 'income-expense':
        return <IncomeExpenseReport timeRange={timeRange} association={association} />;
        
      case 'cash-flow':
        return <CashFlowReport timeRange={timeRange} association={association} />;
        
      case 'admin-billing':
        return <BillingReport timeRange={timeRange} association={association} reportType="admin-billing" />;
        
      case 'billing-report':
        return <BillingReport timeRange={timeRange} association={association} reportType="billing-report" />;
        
      case 'bank-balances':
        return <BankBalancesReport timeRange={timeRange} association={association} />;
        
      case 'cash-forecast':
        return <CashForecastReport timeRange={timeRange} association={association} />;

      // Placeholder for other financial report types
      case 'financial-summary':
      case 'bank-unreconciled':
      case 'invoices-list':
      case 'gl-entry':
      case 'owners-credit':
      case 'service-contract':
        return (
          <div className="py-8 px-4 text-center">
            <p className="text-lg font-medium">Report Under Development</p>
            <p className="text-muted-foreground mt-2">
              The {selectedReport.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} report 
              is currently being developed and will be available soon.
            </p>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">Select a report from the dropdown above</p>
          </div>
        );
    }
  };

  return <div>{renderReportContent()}</div>;
};

export default FinancialReports;
