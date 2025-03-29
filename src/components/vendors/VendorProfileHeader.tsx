
import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Vendor } from '@/types/vendor';
import VendorRating from './VendorRating';
import VendorEditDialog from './VendorEditDialog';

interface VendorProfileHeaderProps {
  vendor: Vendor;
}

const VendorProfileHeader: React.FC<VendorProfileHeaderProps> = ({ vendor }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const initials = vendor.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
      <Avatar className="h-16 w-16 border">
        <AvatarFallback className="text-lg bg-primary/10 text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold">{vendor.name}</h1>
          <Badge variant={vendor.status === 'active' ? 'default' : 'secondary'} className="h-fit">
            {vendor.status === 'active' ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <p className="text-muted-foreground">{vendor.category}</p>
          <VendorRating rating={vendor.rating || 0} />
        </div>
      </div>
      
      <div className="flex items-center gap-2 self-end md:self-auto mt-2 md:mt-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 gap-1"
          onClick={() => setEditDialogOpen(true)}
        >
          <Pencil className="h-4 w-4" />
          Edit Vendor
        </Button>
      </div>

      <VendorEditDialog 
        vendor={vendor} 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen}
      />
    </div>
  );
};

export default VendorProfileHeader;
