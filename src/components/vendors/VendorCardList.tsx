
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Mail, Phone, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { VendorColumn } from './VendorColumnsSelector';
import { Vendor } from '@/types/vendor';
import VendorRating from './VendorRating';

interface VendorCardListProps {
  vendors: Vendor[];
  columns: VendorColumn[];
}

const VendorCardList = ({ vendors, columns }: VendorCardListProps) => {
  const navigate = useNavigate();
  const visibleColumns = columns.filter(col => col.checked);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const handleCardClick = (vendorId: string) => {
    navigate(`/vendors/${vendorId}`);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {vendors.map((vendor) => (
        <Card 
          key={vendor.id} 
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => handleCardClick(vendor.id)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{vendor.name}</h3>
                <p className="text-sm text-muted-foreground">{vendor.contactName}</p>
              </div>
              <Badge variant={vendor.status === 'active' ? 'default' : 'secondary'}>
                {vendor.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <div className="space-y-1 mb-2">
              {visibleColumns.includes(columns.find(c => c.id === 'email')!) && (
                <div className="flex items-center text-sm">
                  <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span>{vendor.email}</span>
                </div>
              )}
              
              {visibleColumns.includes(columns.find(c => c.id === 'phone')!) && (
                <div className="flex items-center text-sm">
                  <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span>{vendor.phone}</span>
                </div>
              )}
              
              {visibleColumns.includes(columns.find(c => c.id === 'category')!) && (
                <div className="flex items-center text-sm">
                  <Building2 className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span>{vendor.category}</span>
                </div>
              )}
              
              {visibleColumns.includes(columns.find(c => c.id === 'lastInvoiceDate')!) && (
                <div className="flex items-center text-sm">
                  <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span>Last Invoice: {formatDate(vendor.lastInvoiceDate)}</span>
                </div>
              )}
            </div>
            
            {visibleColumns.includes(columns.find(c => c.id === 'rating')!) && (
              <div className="mt-2">
                <VendorRating rating={vendor.rating || 0} />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VendorCardList;
