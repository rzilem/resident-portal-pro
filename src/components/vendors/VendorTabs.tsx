
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vendor } from '@/types/vendor';
import VendorDetails from './tabs/VendorDetails';
import VendorServices from './tabs/VendorServices';
import VendorDocuments from './tabs/VendorDocuments';
import VendorInsurance from './tabs/VendorInsurance';
import VendorNotes from './tabs/VendorNotes';

interface VendorTabsProps {
  vendor: Vendor;
}

const VendorTabs: React.FC<VendorTabsProps> = ({ vendor }) => {
  const [activeTab, setActiveTab] = useState('details');
  
  return (
    <Tabs defaultValue="details" onValueChange={setActiveTab} value={activeTab}>
      <TabsList className="grid grid-cols-5">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="insurance">Insurance</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="mt-4">
        <VendorDetails vendor={vendor} />
      </TabsContent>
      
      <TabsContent value="services" className="mt-4">
        <VendorServices vendorId={vendor.id} />
      </TabsContent>
      
      <TabsContent value="documents" className="mt-4">
        <VendorDocuments vendorId={vendor.id} />
      </TabsContent>
      
      <TabsContent value="insurance" className="mt-4">
        <VendorInsurance vendor={vendor} />
      </TabsContent>
      
      <TabsContent value="notes" className="mt-4">
        <VendorNotes vendorId={vendor.id} />
      </TabsContent>
    </Tabs>
  );
};

export default VendorTabs;
