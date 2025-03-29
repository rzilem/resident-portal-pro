
import React from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Vendor } from '@/types/vendor';
import { format } from 'date-fns';
import { Shield, Calendar, DollarSign, FileText } from 'lucide-react';
import PolicyInfoCard from './insurance/PolicyInfoCard';
import CoverageDetailsCard from './insurance/CoverageDetailsCard';
import AgentInfoCard from './insurance/AgentInfoCard';
import DocumentsCard from './insurance/DocumentsCard';
import InsuranceStatusBadge from './insurance/InsuranceStatusBadge';

interface VendorInsuranceTabProps {
  vendor: Vendor;
}

const VendorInsuranceTab: React.FC<VendorInsuranceTabProps> = ({ vendor }) => {
  if (!vendor.insurance) {
    return (
      <CardContent className="p-6 text-center">
        <Shield className="h-12 w-12 mx-auto text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">No Insurance Information</h3>
        <p className="mt-2 text-muted-foreground">
          No insurance details have been added for this vendor.
        </p>
      </CardContent>
    );
  }
  
  const { insurance } = vendor;
  const isExpired = insurance.expirationDate && new Date(insurance.expirationDate) < new Date();
  
  return (
    <>
      <CardHeader className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Insurance Information</CardTitle>
            <CardDescription>Details about vendor's insurance coverage</CardDescription>
          </div>
          <InsuranceStatusBadge isExpired={!!isExpired} />
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PolicyInfoCard insurance={insurance} />
          <CoverageDetailsCard insurance={insurance} />
          <AgentInfoCard insurance={insurance} />
          <DocumentsCard documents={insurance.documents || []} />
        </div>
      </CardContent>
    </>
  );
};

export default VendorInsuranceTab;
