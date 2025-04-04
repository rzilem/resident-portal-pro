import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vendor } from '@/types/vendor';
import VendorDetailsTab from './tabs/VendorDetailsTab';
import VendorServicesTab from './tabs/VendorServicesTab';
import VendorInsuranceTab from './tabs/VendorInsuranceTab';
import VendorInvoicesTab from './tabs/VendorInvoicesTab';
import VendorDocumentsTab from './tabs/VendorDocumentsTab';
import VendorActivityTab from './tabs/VendorActivityTab';
import VendorNotesTab from './tabs/VendorNotesTab';

interface VendorTabsProps {
  vendor: Vendor;
}

const VendorTabs: React.FC<VendorTabsProps> = ({ vendor }) => {
  const [activeTab, setActiveTab] = useState('details');
  
  return (
    <Card>
      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border-b rounded-none p-0 h-auto w-full justify-start">
          <TabsTrigger 
            value="details" 
            className="rounded-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
          >
            Details
          </TabsTrigger>
          
          <TabsTrigger 
            value="services" 
            className="rounded-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
          >
            Services
          </TabsTrigger>
          
          <TabsTrigger 
            value="insurance" 
            className="rounded-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
          >
            Insurance
          </TabsTrigger>
          
          <TabsTrigger 
            value="invoices" 
            className="rounded-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
          >
            Invoices
          </TabsTrigger>
          
          <TabsTrigger 
            value="documents" 
            className="rounded-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
          >
            Documents
          </TabsTrigger>
          
          <TabsTrigger 
            value="activity" 
            className="rounded-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
          >
            Activity
          </TabsTrigger>
          
          <TabsTrigger 
            value="notes" 
            className="rounded-none py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
          >
            Notes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="p-0">
          <VendorDetailsTab vendor={vendor} />
        </TabsContent>
        
        <TabsContent value="services" className="p-0">
          <VendorServicesTab vendor={vendor} />
        </TabsContent>
        
        <TabsContent value="insurance" className="p-0">
          <VendorInsuranceTab vendor={vendor} />
        </TabsContent>
        
        <TabsContent value="invoices" className="p-0">
          <VendorInvoicesTab vendor={vendor} />
        </TabsContent>
        
        <TabsContent value="documents" className="p-0">
          <VendorDocumentsTab vendor={vendor} />
        </TabsContent>
        
        <TabsContent value="activity" className="p-0">
          <VendorActivityTab vendor={vendor} />
        </TabsContent>
        
        <TabsContent value="notes" className="p-0">
          <VendorNotesTab vendor={vendor} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default VendorTabs;
