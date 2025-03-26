import React from 'react';
import { Users, CalendarDays, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Association } from '@/types/association';

interface AssociationStatsProps {
  association: Association;
}

const AssociationStats: React.FC<AssociationStatsProps> = ({ association }) => {
  // Function to get the formatted legal property description
  const getLegalPropertyDescription = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'hoa':
        return 'Homeowners Association';
      case 'coa':
        return 'Condominium Owners Association';
      case 'condo':
        return 'Condominium Association';
      case 'poa':
        return 'Property Owners Association';
      case 'roa':
        return 'Residential Owners Association';
      case 'sfh-condo':
        return 'Single Family Homes within a Condo Regime';
      default:
        return 'Homeowners Association';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            <Users className="h-4 w-4 inline mr-1" /> Units
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{association.units}</div>
          <p className="text-muted-foreground">Total residential units</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            <CalendarDays className="h-4 w-4 inline mr-1" /> Onboarding Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-medium">
            {new Date(association.foundedDate).toLocaleDateString()}
          </div>
          <p className="text-muted-foreground">
            Client since {new Date(association.foundedDate).getFullYear()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            <Building className="h-4 w-4 inline mr-1" /> Legal Property Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-medium">
            {getLegalPropertyDescription(association.type)}
          </div>
          <p className="text-muted-foreground">Property classification</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssociationStats;
