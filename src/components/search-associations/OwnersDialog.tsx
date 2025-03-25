
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import OwnersTable from './OwnersTable';
import { Association, Owner } from './types';

interface OwnersDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  association: Association | null;
  ownerSearchTerm: string;
  onOwnerSearchChange: (value: string) => void;
  filteredOwners: Owner[];
}

const OwnersDialog: React.FC<OwnersDialogProps> = ({
  isOpen,
  onOpenChange,
  association,
  ownerSearchTerm,
  onOwnerSearchChange,
  filteredOwners,
}) => {
  if (!association) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{association.name} - Owners</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input
            placeholder="Search owners by name, unit, or email..."
            value={ownerSearchTerm}
            onChange={(e) => onOwnerSearchChange(e.target.value)}
          />
          
          <OwnersTable owners={filteredOwners} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OwnersDialog;
