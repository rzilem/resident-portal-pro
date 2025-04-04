
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSettings } from '@/hooks/use-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TooltipProvider, 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { List, BarChart2 } from 'lucide-react';
import VendorStats from '@/components/vendors/VendorStats';
import VendorList from '@/components/vendors/VendorList';
import VendorMetricsDashboard from '@/components/vendors/metrics/VendorMetricsDashboard';
import { VendorColumn } from '@/components/vendors/VendorColumnsSelector';
import mockVendors from '@/data/vendorProfiles';

const getDefaultColumns = (): VendorColumn[] => [
  { id: 'name', label: 'Vendor Name', checked: true },
  { id: 'contactName', label: 'Contact Person', checked: true },
  { id: 'email', label: 'Email', checked: true },
  { id: 'phone', label: 'Phone', checked: true },
  { id: 'category', label: 'Category', checked: true },
  { id: 'status', label: 'Status', checked: true },
  { id: 'paymentTerms', label: 'Payment Terms', checked: false },
  { id: 'paymentMethod', label: 'Payment Method', checked: false },
  { id: 'lastInvoiceDate', label: 'Last Invoice', checked: true },
  { id: 'rating', label: 'Rating', checked: true }
];

const Vendors = () => {
  const { preferences } = useSettings();
  const isMobile = useIsMobile();
  
  const [vendors, setVendors] = useState(mockVendors);
  const [columns, setColumns] = useState<VendorColumn[]>(
    preferences?.vendorTableColumns || getDefaultColumns()
  );
  const [activeTab, setActiveTab] = useState<'list' | 'metrics'>('list');
  
  useEffect(() => {
    if (preferences?.vendorTableColumns) {
      setColumns(preferences.vendorTableColumns);
    }
  }, [preferences]);
  
  const handleColumnsChange = (newColumns: VendorColumn[]) => {
    const hasCheckedColumn = newColumns.some(col => col.checked);
    
    if (hasCheckedColumn) {
      setColumns(newColumns);
    }
  };
  
  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
      <div className="grid gap-4 md:gap-6 mb-6">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Vendor Management</h2>
          <p className="text-muted-foreground">Manage your vendor relationships and services</p>
        </section>
        
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as 'list' | 'metrics')}
          className="space-y-4"
        >
          <TabsList>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="list" className="flex items-center gap-1.5">
                    <List className="h-4 w-4" />
                    <span>Vendor List</span>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View and manage vendor list</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="metrics" className="flex items-center gap-1.5">
                    <BarChart2 className="h-4 w-4" />
                    <span>Metrics & Analytics</span>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View vendor performance metrics and insurance tracking</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsList>
          
          <TabsContent value="list" className="space-y-6 mt-6">
            <VendorStats vendors={vendors} />
            
            <VendorList 
              vendors={vendors}
              columns={columns}
              onColumnsChange={handleColumnsChange}
            />
          </TabsContent>
          
          <TabsContent value="metrics" className="mt-6">
            <VendorMetricsDashboard vendors={vendors} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Vendors;
