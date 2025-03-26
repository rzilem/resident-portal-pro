
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Vendor } from '@/types/vendor';
import VendorSummaryTab from './tabs/VendorSummaryTab';
import VendorInvoicesTab from './tabs/VendorInvoicesTab';
import VendorServicesTab from './tabs/VendorServicesTab';
import VendorDocumentsTab from './tabs/VendorDocumentsTab';
import VendorNotesTab from './tabs/VendorNotesTab';
import VendorInsuranceTab from './tabs/VendorInsuranceTab';

interface VendorTabsProps {
  vendor: Vendor;
}

const VendorTabs: React.FC<VendorTabsProps> = ({ vendor }) => {
  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="w-full max-w-full mb-4 flex flex-wrap h-auto p-1 bg-muted/50">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="insurance">Insurance</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      
      <TabsContent value="summary">
        <VendorSummaryTab vendor={vendor} />
      </TabsContent>
      
      <TabsContent value="invoices">
        <VendorInvoicesTab vendorId={vendor.id} />
      </TabsContent>
      
      <TabsContent value="services">
        <VendorServicesTab vendorId={vendor.id} />
      </TabsContent>
      
      <TabsContent value="insurance">
        <VendorInsuranceTab vendor={vendor} />
      </TabsContent>
      
      <TabsContent value="documents">
        <VendorDocumentsTab vendorId={vendor.id} />
      </TabsContent>
      
      <TabsContent value="notes">
        <VendorNotesTab vendorId={vendor.id} />
      </TabsContent>
    </Tabs>
  );
};

export default VendorTabs;
