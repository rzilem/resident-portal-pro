
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { VendorResponseCardProps } from './types';

const VendorResponseCard: React.FC<VendorResponseCardProps> = ({ vendor }) => {
  return (
    <Card className="overflow-hidden">
      <div className={`h-2 ${vendor.status === 'accepted' ? 'bg-green-500' : vendor.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'}`} />
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">Vendor {vendor.vendor_id}</h3>
            <p className="text-sm text-muted-foreground">
              {vendor.response_date 
                ? `Responded on ${format(new Date(vendor.response_date), 'MMM d, yyyy')}`
                : 'Awaiting response'}
            </p>
          </div>
          <Badge variant={vendor.status === 'accepted' ? 'success' : vendor.status === 'rejected' ? 'destructive' : 'outline'}>
            {vendor.status}
          </Badge>
        </div>
        
        {vendor.bid_amount && (
          <div className="mt-3 p-3 bg-muted/50 rounded-md">
            <p className="text-sm font-medium">Bid Amount:</p>
            <p className="text-lg font-bold">${vendor.bid_amount.toFixed(2)}</p>
          </div>
        )}
        
        {vendor.estimated_completion_date && (
          <div className="mt-3 flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">
              Estimated completion: {format(new Date(vendor.estimated_completion_date), 'MMM d, yyyy')}
            </span>
          </div>
        )}
        
        {vendor.response_notes && (
          <div className="mt-3">
            <p className="text-sm font-medium">Notes:</p>
            <p className="text-sm mt-1 whitespace-pre-line">{vendor.response_notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VendorResponseCard;
