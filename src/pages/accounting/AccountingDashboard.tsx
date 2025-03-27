import React, { useState, useEffect } from 'react';
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
import { toast } from 'sonner';

const AccountingDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { associations, activeAssociation, selectAssociation } = useAssociations();
  const [selectedAssociationId, setSelectedAssociationId] = useState<string>('');

  // Initialize selectedAssociationId when activeAssociation becomes available
  useEffect(() => {
    if (activeAssociation && !selectedAssociationId) {
      console.log("Setting initial association ID:", activeAssociation.id);
      setSelectedAssociationId(activeAssociation.id);
    }
  }, [activeAssociation, selectedAssociationId]);

  const handleAssociationChange = (associationId: string) => {
    console.log("Association changed to:", associationId);
    setSelectedAssociationId(associationId);
    const association = associations.find(a => a.id === associationId);
    
    if (association) {
      selectAssociation(association);
      toast.success(`Switched to ${association.name}`);
    }
  };

  return (
    <div className="flex-1">
      <div className="grid gap-4 md:gap-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="hidden md:block">
            {/* Removed redundant paragraph */}
          </div>
          
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
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <DashboardTabs activeTab={activeTab} />
        
        <TabsContent value="overview" className="space-y-6">
          <OverviewTab associationId={selectedAssociationId} />
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-4">
          <InvoiceQueue associationId={selectedAssociationId} />
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <TransactionsTab associationId={selectedAssociationId} />
        </TabsContent>
        
        <TabsContent value="budget" className="space-y-4">
          <BudgetManagement associationId={selectedAssociationId} />
        </TabsContent>
        
        <TabsContent value="statements" className="space-y-4">
          <FinancialStatements associationId={selectedAssociationId} />
        </TabsContent>
        
        <TabsContent value="vendors" className="space-y-4">
          <VendorPayments associationId={selectedAssociationId} />
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <FinancialDocuments associationId={selectedAssociationId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountingDashboard;
