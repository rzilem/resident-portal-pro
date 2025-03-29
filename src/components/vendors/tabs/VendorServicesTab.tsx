
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Vendor } from '@/types/vendor';
import { Wrench } from 'lucide-react';

interface VendorServicesTabProps {
  vendor: Vendor;
}

const VendorServicesTab = ({ vendor }: VendorServicesTabProps) => {
  return (
    <CardContent className="p-6 min-h-[300px] flex flex-col items-center justify-center">
      <Wrench className="h-12 w-12 text-muted-foreground/40" />
      <h3 className="mt-4 text-xl font-medium">Services</h3>
      <p className="mt-2 text-center text-muted-foreground max-w-md">
        Manage the services offered by this vendor. This feature will be implemented in the next phase.
      </p>
    </CardContent>
  );
};

export default VendorServicesTab;
