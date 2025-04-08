
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import VendorForm from './VendorForm';
import { useVendors } from '@/hooks/useVendors';
import { Vendor } from '@/types/vendor';

interface VendorCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VendorCreateDialog: React.FC<VendorCreateDialogProps> = ({ open, onOpenChange }) => {
  const { createVendor, isCreating } = useVendors();

  const handleCreateVendor = (formData: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => {
    createVendor(formData, {
      onSuccess: () => {
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Vendor</DialogTitle>
        </DialogHeader>
        <VendorForm 
          onSubmit={handleCreateVendor}
          isSubmitting={isCreating}
        />
      </DialogContent>
    </Dialog>
  );
};

export default VendorCreateDialog;
