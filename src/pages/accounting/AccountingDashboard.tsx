
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
import { useAssociations } from '@/hooks/use-associations';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Building } from 'lucide-react';

const AccountingDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { associations, activeAssociation, selectAssociation } = useAssociations();
  const [selectedAssociationId, setSelectedAssociationId] = useState<string>(
    activeAssociation?.id || ''
  );

  const handleAssociationChange = (associationId: string) => {
    setSelectedAssociationId(associationId);
    const association = associations.find(a => a.id === associationId);
    if (association) {
      selectAssociation(association);
    }
  };

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
          
          {/* Association Selector */}
          <div className="md:w-72 mt-4 md:mt-0">
            <Select 
              value={selectedAssociationId} 
              onValueChange={handleAssociationChange}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <SelectValue placeholder="Select Association" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {associations.map((association) => (
                  <SelectItem 
                    key={association.id} 
                    value={association.id}
                  >
                    {association.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
