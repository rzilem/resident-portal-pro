
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import FinancialReports from '@/components/reports/FinancialReports';

const AccountingReports = () => {
  // Default values for the required props
  const [timeRange, setTimeRange] = useState('year');
  const [association, setAssociation] = useState('all');
  const [selectedReport, setSelectedReport] = useState('income-expense');

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Accounting Reports</h1>
        <FinancialReports 
          timeRange={timeRange}
          association={association}
          selectedReport={selectedReport}
        />
      </div>
    </DashboardLayout>
  );
};

export default AccountingReports;
