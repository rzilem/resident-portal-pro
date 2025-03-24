
import React, { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import InvoiceQueue from '@/components/accounting/InvoiceQueue';
import BudgetManagement from '@/components/accounting/BudgetManagement';
import FinancialStatements from '@/components/accounting/FinancialStatements';
import VendorPayments from '@/components/accounting/VendorPayments';
import FinancialDocuments from '@/components/accounting/FinancialDocuments';
import DashboardTabs from '@/components/accounting/dashboard/DashboardTabs';
import OverviewTab from '@/components/accounting/dashboard/OverviewTab';
import TransactionsTab from '@/components/accounting/dashboard/TransactionsTab';

const AccountingDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex-1">
      <div className="grid gap-4 md:gap-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Accounting Dashboard</h1>
            <p className="text-muted-foreground">
              Manage all financial aspects of your properties and associations
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Tabs */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <DashboardTabs activeTab={activeTab} />
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <OverviewTab />
        </TabsContent>
        
        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-4">
          <InvoiceQueue />
        </TabsContent>
        
        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <TransactionsTab />
        </TabsContent>
        
        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-4">
          <BudgetManagement />
        </TabsContent>
        
        {/* Financial Statements Tab */}
        <TabsContent value="statements" className="space-y-4">
          <FinancialStatements />
        </TabsContent>
        
        {/* Vendor Payments Tab */}
        <TabsContent value="vendors" className="space-y-4">
          <VendorPayments />
        </TabsContent>
        
        {/* Financial Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <FinancialDocuments />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountingDashboard;
