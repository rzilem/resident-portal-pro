
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Vendor } from '@/types/vendor';
import { Phone, Mail, MapPin, CreditCard, Tag, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface VendorSummaryTabProps {
  vendor: Vendor;
}

const VendorSummaryTab: React.FC<VendorSummaryTabProps> = ({ vendor }) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };
  
  return (
    <CardContent className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Phone className="h-4 w-4 mt-1 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">{vendor.phone}</p>
                  <p className="text-sm text-muted-foreground">Primary Phone</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-4 w-4 mt-1 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">{vendor.email}</p>
                  <p className="text-sm text-muted-foreground">Email</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mt-1 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">{vendor.address}</p>
                  <p className="text-sm text-muted-foreground">Business Address</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <CreditCard className="h-4 w-4 mt-1 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">{vendor.paymentMethod}</p>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="h-4 w-4 mt-1 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">{vendor.paymentTerms}</p>
                  <p className="text-sm text-muted-foreground">Payment Terms</p>
                </div>
              </div>
              
              {vendor.taxId && (
                <div className="flex items-start">
                  <div className="h-4 w-4 mt-1 mr-3 text-muted-foreground">#</div>
                  <div>
                    <p className="font-medium">{vendor.taxId}</p>
                    <p className="text-sm text-muted-foreground">Tax ID</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            {vendor.services && vendor.services.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {vendor.services.map((service, index) => (
                  <Badge key={index} variant="secondary">{service}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No services listed</p>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            {vendor.tags && vendor.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {vendor.tags.map((tag) => (
                  <Badge 
                    key={tag.id} 
                    variant={
                      tag.type === 'positive' ? 'default' : 
                      tag.type === 'negative' ? 'destructive' : 
                      'outline'
                    }
                  >
                    {tag.label}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No tags</p>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Vendor Since</p>
                <p className="font-medium">{formatDate(vendor.createdAt)}</p>
              </div>
              
              {vendor.lastInvoiceDate && (
                <div>
                  <p className="text-sm text-muted-foreground">Last Invoice</p>
                  <p className="font-medium">{formatDate(vendor.lastInvoiceDate)}</p>
                </div>
              )}
              
              {vendor.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium">{vendor.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  );
};

export default VendorSummaryTab;
