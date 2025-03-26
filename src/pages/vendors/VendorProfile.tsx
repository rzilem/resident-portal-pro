
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VendorProfileHeader from '@/components/vendors/VendorProfileHeader';
import VendorTabs from '@/components/vendors/VendorTabs';
import VendorNotFound from '@/components/vendors/VendorNotFound';
import mockVendors from '@/data/vendorProfiles';

const VendorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const vendor = mockVendors.find(v => v.id === id);

  if (!vendor) {
    return <VendorNotFound />;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 animate-fade-in">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4 gap-1" 
        onClick={() => navigate('/vendors')}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Vendors
      </Button>
      
      <VendorProfileHeader vendor={vendor} />
      
      <div className="flex items-center gap-2 text-muted-foreground mt-1 mb-6">
        <Building2 className="h-4 w-4" />
        <span>{vendor.category} • {vendor.status === 'active' ? 'Active' : 'Inactive'}</span>
      </div>
      
      <VendorTabs vendor={vendor} />
    </div>
  );
};

export default VendorProfile;
