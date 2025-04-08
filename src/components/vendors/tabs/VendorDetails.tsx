
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Vendor } from '@/types/vendor';
import { Building2, User, Mail, Phone, MapPin, Calendar, FileText, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

interface VendorDetailsProps {
  vendor: Vendor;
}

const VendorDetails: React.FC<VendorDetailsProps> = ({ vendor }) => {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {vendor.contactName && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Contact Person</div>
                  <div className="text-sm text-muted-foreground">{vendor.contactName}</div>
                </div>
              </div>
            )}
            
            {vendor.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">
                    <a href={`mailto:${vendor.email}`} className="hover:underline">{vendor.email}</a>
                  </div>
                </div>
              </div>
            )}
            
            {vendor.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Phone</div>
                  <div className="text-sm text-muted-foreground">
                    <a href={`tel:${vendor.phone}`} className="hover:underline">{vendor.phone}</a>
                  </div>
                </div>
              </div>
            )}
            
            {vendor.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Address</div>
                  <div className="text-sm text-muted-foreground">{vendor.address}</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Business Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Category</div>
                <div className="text-sm text-muted-foreground">{vendor.category}</div>
              </div>
            </div>
            
            {vendor.taxId && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Tax ID</div>
                  <div className="text-sm text-muted-foreground">{vendor.taxId}</div>
                </div>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-4">
              {vendor.paymentTerms && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Payment Terms</div>
                    <div className="text-sm text-muted-foreground">{vendor.paymentTerms}</div>
                  </div>
                </div>
              )}
              
              {vendor.paymentMethod && (
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Payment Method</div>
                    <div className="text-sm text-muted-foreground">{vendor.paymentMethod}</div>
                  </div>
                </div>
              )}
            </div>
            
            {vendor.lastInvoiceDate && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Last Invoice Date</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(vendor.lastInvoiceDate), 'MMM dd, yyyy')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {vendor.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{vendor.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VendorDetails;
