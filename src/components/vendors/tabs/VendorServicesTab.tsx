
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { getVendorServices } from '@/data/vendorProfiles';
import { VendorService } from '@/types/vendor';

interface VendorServicesTabProps {
  vendorId: string;
}

const VendorServicesTab: React.FC<VendorServicesTabProps> = ({ vendorId }) => {
  const [services] = useState<VendorService[]>(getVendorServices(vendorId));

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatRateType = (rateType?: string) => {
    if (!rateType) return '';
    switch (rateType) {
      case 'hourly':
        return '/hour';
      case 'monthly':
        return '/month';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Services Provided</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Rate Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>{service.description || 'N/A'}</TableCell>
                <TableCell>{formatCurrency(service.rate)}</TableCell>
                <TableCell>
                  {service.rateType ? service.rateType.charAt(0).toUpperCase() + service.rateType.slice(1) + formatRateType(service.rateType) : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
            {services.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  No services listed
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default VendorServicesTab;
