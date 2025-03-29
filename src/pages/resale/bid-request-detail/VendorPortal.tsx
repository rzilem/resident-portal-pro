
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VendorPortalProps } from './types';

const VendorPortal: React.FC<VendorPortalProps> = ({ id }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Vendor Portal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Share this link with vendors to allow them to submit bids
        </p>
        <div className="p-3 bg-muted/40 rounded-md">
          <code className="text-xs break-all text-blue-600">
            https://vendor.example.com/bid/{id}
          </code>
        </div>
        <Button className="w-full" variant="outline">
          Copy Vendor Link
        </Button>
      </CardContent>
    </Card>
  );
};

export default VendorPortal;
