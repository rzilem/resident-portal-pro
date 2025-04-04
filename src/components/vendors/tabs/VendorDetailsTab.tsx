
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Vendor } from '@/types/vendor';

interface VendorDetailsTabProps {
  vendor: Vendor;
}

const VendorDetailsTab = ({ vendor }: VendorDetailsTabProps) => {
  return (
    <CardContent className="p-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Vendor Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Name</div>
              <div>{vendor.name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Contact Person</div>
              <div>{vendor.contactName || "Not specified"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Email</div>
              <div>{vendor.email || "Not specified"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Phone</div>
              <div>{vendor.phone || "Not specified"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Address</div>
              <div>{vendor.address || "Not specified"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Category</div>
              <div>{vendor.category || "Not specified"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Status</div>
              <div className="capitalize">{vendor.status || "Unknown"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Tax ID</div>
              <div>{vendor.taxId || "Not specified"}</div>
            </div>
          </div>
        </div>
        
        {vendor.tags && vendor.tags.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {vendor.tags.map(tag => (
                <div 
                  key={tag.id} 
                  className={`px-2 py-1 text-xs rounded-full ${tag.color || 'bg-gray-100'}`}
                >
                  {tag.label}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {vendor.notes && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Notes</h3>
            <div className="p-3 bg-muted rounded-md">
              {vendor.notes}
            </div>
          </div>
        )}
      </div>
    </CardContent>
  );
};

export default VendorDetailsTab;
