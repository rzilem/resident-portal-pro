
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Vendor } from '@/types/vendor';
import { Activity } from 'lucide-react';

interface VendorActivityTabProps {
  vendor: Vendor;
}

const VendorActivityTab = ({ vendor }: VendorActivityTabProps) => {
  return (
    <CardContent className="p-6 min-h-[300px] flex flex-col items-center justify-center">
      <Activity className="h-12 w-12 text-muted-foreground/40" />
      <h3 className="mt-4 text-xl font-medium">Activity History</h3>
      <p className="mt-2 text-center text-muted-foreground max-w-md">
        View recent activity and changes for this vendor. This feature will be implemented in the next phase.
      </p>
    </CardContent>
  );
};

export default VendorActivityTab;
