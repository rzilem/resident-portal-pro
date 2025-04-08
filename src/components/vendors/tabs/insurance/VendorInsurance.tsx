
import React from 'react';
import { Vendor, VendorInsurance as VendorInsuranceType } from '@/types/vendor';
import { Grid } from '@/components/ui/grid';
import PolicyInfoCard from './PolicyInfoCard';
import AgentInfoCard from './AgentInfoCard';
import CoverageDetailsCard from './CoverageDetailsCard';
import DocumentsCard from './DocumentsCard';
import { useVendor } from '@/hooks/useVendors';
import InsuranceDocumentUploader from './InsuranceDocumentUploader';

interface VendorInsuranceProps {
  vendor: Vendor;
}

const VendorInsurance: React.FC<VendorInsuranceProps> = ({ vendor }) => {
  const { vendor: updatedVendor, refetchVendor } = useVendor(vendor.id);
  
  // Use the latest vendor data (may contain updates)
  const currentVendor = updatedVendor || vendor;
  const insurance = currentVendor.insurance as VendorInsuranceType;
  
  const handleDocumentsRefresh = () => {
    refetchVendor();
  };
  
  return (
    <div className="space-y-6">
      <Grid columns={2} className="gap-4">
        <PolicyInfoCard insurance={insurance} />
        <AgentInfoCard insurance={insurance} />
      </Grid>
      
      <Grid columns={2} className="gap-4">
        <CoverageDetailsCard insurance={insurance} />
        <DocumentsCard 
          documents={insurance?.documents || []} 
          onRefresh={handleDocumentsRefresh}
        />
      </Grid>
      
      <InsuranceDocumentUploader 
        vendor={vendor}
        onDocumentUploaded={handleDocumentsRefresh}
      />
    </div>
  );
};

export default VendorInsurance;
