
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, ShieldCheck, AlertTriangle, DollarSign } from 'lucide-react';
import { Vendor } from '@/types/vendor';

interface VendorStatsProps {
  vendors: Vendor[];
}

const VendorStats: React.FC<VendorStatsProps> = ({ vendors }) => {
  const activeVendors = vendors.filter(v => v.status === 'active').length;
  const inactiveVendors = vendors.filter(v => v.status === 'inactive').length;
  const categories = [...new Set(vendors.map(v => v.category))].length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Vendors</p>
              <h3 className="text-2xl font-bold">{vendors.length}</h3>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Active Vendors</p>
              <h3 className="text-2xl font-bold">{activeVendors}</h3>
            </div>
            <div className="p-2 bg-green-500/10 rounded-full">
              <ShieldCheck className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Inactive Vendors</p>
              <h3 className="text-2xl font-bold">{inactiveVendors}</h3>
            </div>
            <div className="p-2 bg-yellow-500/10 rounded-full">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Categories</p>
              <h3 className="text-2xl font-bold">{categories}</h3>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorStats;
