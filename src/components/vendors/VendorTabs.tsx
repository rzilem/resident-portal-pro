
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Vendor } from '@/types/vendor';
import VendorSummaryTab from './tabs/VendorSummaryTab';
import VendorInvoicesTab from './tabs/VendorInvoicesTab';
import VendorServicesTab from './tabs/VendorServicesTab';
import VendorDocumentsTab from './tabs/VendorDocumentsTab';
import VendorInsuranceTab from './tabs/VendorInsuranceTab';
import VendorNotesTab from './tabs/VendorNotesTab';

interface VendorTabsProps {
  vendor: Vendor;
}

const VendorTabs: React.FC<VendorTabsProps> = ({ vendor }) => {
  const [activeTab, setActiveTab] = useState('summary');
  
  return (
    <Tabs 
      defaultValue="summary" 
      value={activeTab}
      onValueChange={setActiveTab}
      className="space-y-4"
    >
      <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="insurance">Insurance</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      
      <Card>
        <TabsContent value="summary" className="mt-0">
          <VendorSummaryTab vendor={vendor} />
        </TabsContent>
        
        <TabsContent value="invoices" className="mt-0">
          <VendorInvoicesTab vendor={vendor} />
        </TabsContent>
        
        <TabsContent value="services" className="mt-0">
          <VendorServicesTab vendor={vendor} />
        </TabsContent>
        
        <TabsContent value="documents" className="mt-0">
          <VendorDocumentsTab vendor={vendor} />
        </TabsContent>
        
        <TabsContent value="insurance" className="mt-0">
          <VendorInsuranceTab vendor={vendor} />
        </TabsContent>
        
        <TabsContent value="notes" className="mt-0">
          <VendorNotesTab vendor={vendor} />
        </TabsContent>
      </Card>
    </Tabs>
  );
};

export default VendorTabs;
