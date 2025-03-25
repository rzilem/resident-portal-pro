
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GLAccount } from '@/types/accounting';
import GlAccountForm from './GlAccountForm';

interface GlAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: GLAccount | null;
  onSave: (account: GLAccount) => void;
  onCancel: () => void;
}

const GlAccountDialog: React.FC<GlAccountDialogProps> = ({
  open,
  onOpenChange,
  account,
  onSave,
  onCancel
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{account ? 'Edit GL Account' : 'Add GL Account'}</DialogTitle>
          <DialogDescription>
            {account 
              ? 'Update the details for this GL account.' 
              : 'Create a new general ledger account.'}
          </DialogDescription>
        </DialogHeader>
        
        <GlAccountForm 
          account={account}
          onSave={onSave}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default GlAccountDialog;
