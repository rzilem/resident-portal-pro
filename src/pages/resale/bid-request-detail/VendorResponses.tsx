
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileClock } from 'lucide-react';
import VendorResponseCard from './VendorResponseCard';
import { VendorResponsesProps } from './types';

const VendorResponses: React.FC<VendorResponsesProps> = ({ bidVendors }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Vendor Responses</CardTitle>
        <CardDescription>
          Track responses from vendors for this bid request
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bidVendors.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileClock className="mx-auto h-12 w-12 mb-3 text-muted-foreground/50" />
            <p>No vendor responses yet</p>
            <p className="text-sm mt-1">Vendors will appear here when they respond to your bid request</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bidVendors.map((vendor) => (
              <VendorResponseCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VendorResponses;
