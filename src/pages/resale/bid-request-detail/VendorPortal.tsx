
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VendorPortalProps } from './types';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

const VendorPortal: React.FC<VendorPortalProps> = ({ id }) => {
  const [copied, setCopied] = useState(false);
  const vendorLink = `https://vendor.example.com/bid/${id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(vendorLink)
      .then(() => {
        setCopied(true);
        toast.success('Vendor link copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  };

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
            {vendorLink}
          </code>
        </div>
        <Button 
          className="w-full" 
          variant="outline"
          onClick={handleCopyLink}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Link Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy Vendor Link
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VendorPortal;
