
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AssociationList from './search-associations/AssociationList';
import AssociationDetails from './search-associations/AssociationDetails';
import OwnersDialog from './search-associations/OwnersDialog';
import { associationsData } from './search-associations/mock-data';
import { Association } from './search-associations/types';

const SearchAssociations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssociation, setSelectedAssociation] = useState<Association | null>(null);
  const [ownerSearchTerm, setOwnerSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter associations based on search term
  const filteredAssociations = associationsData.filter(association => 
    association.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    association.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter owners for the selected association
  const filteredOwners = selectedAssociation?.owners.filter(owner =>
    owner.name.toLowerCase().includes(ownerSearchTerm.toLowerCase()) ||
    owner.unit.toLowerCase().includes(ownerSearchTerm.toLowerCase()) ||
    owner.email.toLowerCase().includes(ownerSearchTerm.toLowerCase())
  ) || [];

  const handleAssociationSelect = (association: Association) => {
    setSelectedAssociation(association);
    setOwnerSearchTerm('');
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setOwnerSearchTerm('');
    }
  };

  const handleViewOwnersClick = (association: Association) => {
    setSelectedAssociation(association);
    setIsDialogOpen(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Search Associations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="association-search">Find Association</Label>
          <AssociationList 
            associations={filteredAssociations}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAssociationSelect={handleAssociationSelect}
            onViewOwnersClick={handleViewOwnersClick}
          />
        </div>
        
        {selectedAssociation && !isDialogOpen && (
          <AssociationDetails 
            association={selectedAssociation}
            ownerSearchTerm={ownerSearchTerm}
            onOwnerSearchChange={setOwnerSearchTerm}
            filteredOwners={filteredOwners}
          />
        )}

        <OwnersDialog 
          isOpen={isDialogOpen}
          onOpenChange={handleDialogOpenChange}
          association={selectedAssociation}
          ownerSearchTerm={ownerSearchTerm}
          onOwnerSearchChange={setOwnerSearchTerm}
          filteredOwners={filteredOwners}
        />
      </CardContent>
    </Card>
  );
};

export default SearchAssociations;
