
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Ship, Lock, Footprints, Building, Landmark } from 'lucide-react';

interface AmenityBadgeProps {
  type: 'pool' | 'gate' | 'pedestrianGate' | 'elevator' | 'amenityCenter';
  active: boolean;
}

const AmenityBadge: React.FC<AmenityBadgeProps> = ({ type, active }) => {
  if (!active) return null;

  const amenities = {
    pool: {
      icon: <Ship className="h-3 w-3 mr-1" />,
      label: 'Pool',
    },
    gate: {
      icon: <Lock className="h-3 w-3 mr-1" />,
      label: 'Gate',
    },
    pedestrianGate: {
      icon: <Footprints className="h-3 w-3 mr-1" />,
      label: 'Pedestrian Gate',
    },
    elevator: {
      icon: <Building className="h-3 w-3 mr-1" />,
      label: 'Elevator',
    },
    amenityCenter: {
      icon: <Landmark className="h-3 w-3 mr-1" />,
      label: 'Amenity Center',
    },
  };

  const amenity = amenities[type];

  return (
    <Badge variant="outline" className="bg-muted flex items-center">
      {amenity.icon}
      {amenity.label}
    </Badge>
  );
};

export default AmenityBadge;
