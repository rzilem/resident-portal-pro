
import React from 'react';
import Reports from '@/pages/Reports';
import FinancialReportDetail from '@/components/reports/FinancialReportDetail';
import PropertyReportDetail from '@/components/reports/PropertyReportDetail';
import ResidentReportDetail from '@/components/reports/ResidentReportDetail';

export const reportsRoutes = [
  {
    path: '/reports',
    element: <Reports />
  },
  {
    path: '/reports/financial/:reportId',
    element: <FinancialReportDetail />
  },
  {
    path: '/reports/property/:reportId',
    element: <PropertyReportDetail />
  },
  {
    path: '/reports/resident/:reportId',
    element: <ResidentReportDetail />
  }
];
