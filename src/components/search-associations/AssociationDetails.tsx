
import React from 'react';
import { Input } from '@/components/ui/input';
import OwnersTable from './OwnersTable';
import { Association, Owner } from './types';

interface AssociationDetailsProps {
  association: Association;
  ownerSearchTerm: string;
  onOwnerSearchChange: (value: string) => void;
  filteredOwners: Owner[];
}

const AssociationDetails: React.FC<AssociationDetailsProps> = ({
  association,
  ownerSearchTerm,
  onOwnerSearchChange,
  filteredOwners,
}) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2">{association.name}</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {association.location} • {association.owners.length} Owners
      </p>
      
      <Input
        placeholder="Search owners by name, unit, or email..."
        value={ownerSearchTerm}
        onChange={(e) => onOwnerSearchChange(e.target.value)}
        className="mb-4"
      />
      
      <OwnersTable owners={filteredOwners} />
    </div>
  );
};

export default AssociationDetails;
