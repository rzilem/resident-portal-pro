
import React from 'react';
import { Vendor } from '@/types/vendor';
import { PolicyInfoCard } from './insurance/PolicyInfoCard';
import { DocumentsCard } from './insurance/DocumentsCard';
import { AgentInfoCard } from './insurance/AgentInfoCard';
import { CoverageDetailsCard } from './insurance/CoverageDetailsCard';

interface VendorInsuranceTabProps {
  vendor: Vendor;
}

const VendorInsuranceTab: React.FC<VendorInsuranceTabProps> = ({ vendor }) => {
  const insurance = vendor.insurance || {};
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <PolicyInfoCard insurance={insurance} />
        <DocumentsCard insurance={insurance} />
      </div>
      
      <div className="space-y-6">
        <AgentInfoCard insurance={insurance} />
        <CoverageDetailsCard insurance={insurance} />
      </div>
    </div>
  );
};

export default VendorInsuranceTab;
