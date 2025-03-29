
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Vendor } from '@/types/vendor';

interface VendorStatsProps {
  vendors: Vendor[];
}

const VendorStats: React.FC<VendorStatsProps> = ({ vendors }) => {
  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.status === 'active').length;
  const inactiveVendors = totalVendors - activeVendors;
  
  // Calculate percentage of active vendors
  const activePercentage = totalVendors > 0 ? (activeVendors / totalVendors) * 100 : 0;
  
  // Group vendors by category
  const categoryCounts = vendors.reduce((acc, vendor) => {
    acc[vendor.category] = (acc[vendor.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Find the most common category
  let topCategory = { name: 'None', count: 0 };
  Object.entries(categoryCounts).forEach(([category, count]) => {
    if (count > topCategory.count) {
      topCategory = { name: category, count };
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Vendors</p>
              <h3 className="text-2xl font-bold mt-1">{totalVendors}</h3>
            </div>
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Vendors</p>
              <h3 className="text-2xl font-bold mt-1">{activeVendors}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {activePercentage.toFixed(0)}% of total
              </p>
            </div>
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Inactive Vendors</p>
              <h3 className="text-2xl font-bold mt-1">{inactiveVendors}</h3>
            </div>
            <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Top Category</p>
              <h3 className="text-2xl font-bold mt-1">{topCategory.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {topCategory.count} vendor{topCategory.count !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorStats;
