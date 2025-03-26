
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AmenityBadge from '@/components/associations/AmenityBadge';
import { Association } from '@/types/association';

interface AssociationAmenitiesProps {
  association: Association;
}

const AssociationAmenities: React.FC<AssociationAmenitiesProps> = ({ association }) => {
  const hasNoAmenities = (
    !association.settings?.hasPool && 
    !association.settings?.hasGate && 
    !association.settings?.hasPedestrianGate && 
    !association.settings?.hasElevator && 
    !association.settings?.hasAmenityCenter
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Amenities & Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <AmenityBadge type="pool" active={association.settings?.hasPool === true} />
          <AmenityBadge type="gate" active={association.settings?.hasGate === true} />
          <AmenityBadge type="pedestrianGate" active={association.settings?.hasPedestrianGate === true} />
          <AmenityBadge type="elevator" active={association.settings?.hasElevator === true} />
          <AmenityBadge type="amenityCenter" active={association.settings?.hasAmenityCenter === true} />
        </div>
        
        {hasNoAmenities && (
          <p className="text-muted-foreground text-sm mt-2">No amenities information available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AssociationAmenities;
