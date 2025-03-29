
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import VendorEditForm from './VendorEditForm';
import { Vendor } from '@/types/vendor';
import { toast } from "sonner";

interface VendorEditDialogProps {
  vendor: Vendor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VendorEditDialog: React.FC<VendorEditDialogProps> = ({ 
  vendor, 
  open, 
  onOpenChange 
}) => {
  const handleSubmit = (values: any) => {
    // In a real application, this would call an API to update the vendor
    console.log("Updating vendor with values:", values);
    
    // Show success message
    toast.success("Vendor updated successfully");
    
    // Close the dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Vendor</DialogTitle>
        </DialogHeader>
        <VendorEditForm vendor={vendor} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default VendorEditDialog;
