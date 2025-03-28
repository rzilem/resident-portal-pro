
import React from 'react';
import { Card } from '@/components/ui/card';
import IncomeExpenseReport from './financial/IncomeExpenseReport';
import CashFlowReport from './financial/CashFlowReport';
import CashForecastReport from './financial/CashForecastReport';
import BankBalancesReport from './financial/BankBalancesReport';
import BillingReport from './financial/BillingReport';

interface FinancialReportsProps {
  timeRange: string;
  association: string;
  selectedReport: string;
}

const FinancialReports: React.FC<FinancialReportsProps> = ({
  timeRange,
  association,
  selectedReport,
}) => {
  // When association changes, this component will re-render with the new association value
  console.log("Financial Reports rendering with association:", association);
  
  return (
    <Card className="p-6">
      {selectedReport === 'income-expense' && (
        <IncomeExpenseReport timeRange={timeRange} association={association} />
      )}
      
      {selectedReport === 'cash-flow' && (
        <CashFlowReport timeRange={timeRange} association={association} />
      )}
      
      {selectedReport === 'forecast' || selectedReport === 'cash-forecast' && (
        <CashForecastReport timeRange={timeRange} association={association} />
      )}
      
      {selectedReport === 'bank-balances' && (
        <BankBalancesReport timeRange={timeRange} association={association} />
      )}
      
      {selectedReport === 'billing' || selectedReport === 'billing-report' && (
        <BillingReport 
          timeRange={timeRange} 
          association={association} 
          reportType="billing-report" 
        />
      )}
      
      {/* Default fallback if no report is selected */}
      {!['income-expense', 'cash-flow', 'forecast', 'cash-forecast', 'bank-balances', 'billing', 'billing-report'].includes(selectedReport) && (
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold mb-2">Select a report type</h2>
          <p className="text-muted-foreground">
            Choose a report type from the tabs above to view financial data
          </p>
        </div>
      )}
    </Card>
  );
};

export default FinancialReports;
