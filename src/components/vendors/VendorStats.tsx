
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Truck, Box, FileCheck, AlertTriangle, Building2, Shield } from "lucide-react";
import { Vendor } from '@/types/vendor';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
}

const StatCard = ({ title, value, icon, color = "bg-primary/10" }: StatCardProps) => (
  <Card>
    <CardContent className="p-4 flex items-center">
      <div className={`${color} p-2 rounded-lg mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-medium">{value}</h3>
      </div>
    </CardContent>
  </Card>
);

interface VendorStatsProps {
  vendors: Vendor[];
  isLoading?: boolean;
}

const VendorStats: React.FC<VendorStatsProps> = ({ vendors, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-8 w-8 mb-2 rounded" />
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-6 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const activeVendors = vendors.filter(v => v.status === 'active').length;
  const inactiveVendors = vendors.filter(v => v.status === 'inactive').length;
  
  const categories = vendors.reduce((acc, vendor) => {
    if (vendor.category) {
      acc[vendor.category] = (acc[vendor.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
  
  // Calculate vendors with insurance expiring soon (within 30 days)
  const vendorsWithInsurance = vendors.filter(v => v.insurance && v.insurance.expirationDate).length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard 
        title="Total Vendors" 
        value={vendors.length} 
        icon={<Truck className="text-primary h-5 w-5" />} 
      />
      
      <StatCard 
        title="Active Vendors" 
        value={activeVendors} 
        icon={<Box className="text-green-600 h-5 w-5" />} 
        color="bg-green-100"
      />
      
      <StatCard 
        title="Inactive Vendors" 
        value={inactiveVendors} 
        icon={<AlertTriangle className="text-yellow-600 h-5 w-5" />} 
        color="bg-yellow-100"
      />
      
      <StatCard 
        title="Top Category" 
        value={topCategory} 
        icon={<Building2 className="text-blue-600 h-5 w-5" />} 
        color="bg-blue-100"
      />
      
      <StatCard 
        title="Service Categories" 
        value={Object.keys(categories).length} 
        icon={<FileCheck className="text-indigo-600 h-5 w-5" />} 
        color="bg-indigo-100"
      />
      
      <StatCard 
        title="With Insurance" 
        value={vendorsWithInsurance} 
        icon={<Shield className="text-purple-600 h-5 w-5" />} 
        color="bg-purple-100"
      />
    </div>
  );
};

export default VendorStats;
