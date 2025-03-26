
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddPaymentMethodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newMethodName: string;
  setNewMethodName: (name: string) => void;
  newMethodFee: string;
  setNewMethodFee: (fee: string) => void;
  newMethodFeeType: 'percentage' | 'flat';
  setNewMethodFeeType: (feeType: 'percentage' | 'flat') => void;
  onAdd: () => void;
}

const AddPaymentMethodDialog: React.FC<AddPaymentMethodDialogProps> = ({
  isOpen,
  onClose,
  newMethodName,
  setNewMethodName,
  newMethodFee,
  setNewMethodFee,
  newMethodFeeType,
  setNewMethodFeeType,
  onAdd
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Payment Method</DialogTitle>
          <DialogDescription>
            Create a new payment method option for residents
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="method-name">Method Name</Label>
            <Input 
              id="method-name" 
              placeholder="e.g., PayPal, Venmo" 
              value={newMethodName}
              onChange={(e) => setNewMethodName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fee">Processing Fee</Label>
            <div className="flex space-x-2">
              <Input 
                id="fee" 
                type="number" 
                min="0" 
                step="0.01" 
                value={newMethodFee}
                onChange={(e) => setNewMethodFee(e.target.value)}
              />
              <Select 
                value={newMethodFeeType} 
                onValueChange={(value) => setNewMethodFeeType(value as 'percentage' | 'flat')}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Fee Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="flat">Flat Fee ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onAdd}>
            Add Payment Method
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentMethodDialog;
