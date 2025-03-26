
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PropertyListReport from '@/components/reports/property/PropertyListReport';
import { Property } from '@/components/properties/PropertyHelpers';
import { Association } from '@/types/association';

interface AssociationPropertiesTabProps {
  properties: Property[];
  association: Association;
}

const AssociationPropertiesTab: React.FC<AssociationPropertiesTabProps> = ({ properties, association }) => {
  return (
    <div className="mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyListReport 
            properties={properties}
            timeRange="All Time"
            association={association.name}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AssociationPropertiesTab;
