
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Vendor } from '@/types/vendor';
import VendorSummaryTab from './VendorSummaryTab';

interface VendorDetailsTabProps {
  vendor: Vendor;
}

const VendorDetailsTab = ({ vendor }: VendorDetailsTabProps) => {
  return (
    <CardContent className="p-0">
      <VendorSummaryTab vendor={vendor} />
    </CardContent>
  );
};

export default VendorDetailsTab;
