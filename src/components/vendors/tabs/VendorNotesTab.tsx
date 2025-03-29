
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Vendor } from '@/types/vendor';
import { FileText } from 'lucide-react';

interface VendorNotesTabProps {
  vendor: Vendor;
}

const VendorNotesTab = ({ vendor }: VendorNotesTabProps) => {
  return (
    <CardContent className="p-6 min-h-[300px] flex flex-col items-center justify-center">
      <FileText className="h-12 w-12 text-muted-foreground/40" />
      <h3 className="mt-4 text-xl font-medium">Notes</h3>
      <p className="mt-2 text-center text-muted-foreground max-w-md">
        View and manage notes for this vendor. This feature will be implemented in the next phase.
      </p>
    </CardContent>
  );
};

export default VendorNotesTab;
