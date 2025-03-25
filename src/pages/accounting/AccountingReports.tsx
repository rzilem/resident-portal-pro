
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import FinancialReports from '@/components/reports/FinancialReports';

const AccountingReports = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Accounting Reports</h1>
        <FinancialReports />
      </div>
    </DashboardLayout>
  );
};

export default AccountingReports;
