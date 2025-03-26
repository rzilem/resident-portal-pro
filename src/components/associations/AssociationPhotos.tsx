
import React from 'react';
import { Image } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PropertyImage from '@/components/associations/PropertyImage';

interface AssociationPhotosProps {
  associationName: string;
  propertyImages: string[];
}

const AssociationPhotos: React.FC<AssociationPhotosProps> = ({ associationName, propertyImages }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Property Photos
        </CardTitle>
        <CardDescription>{associationName} property images</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PropertyImage 
            url={propertyImages[0]} 
            alt={`${associationName} property`} 
            aspectRatio="video"
            className="md:col-span-2"
          />
          <PropertyImage 
            url={propertyImages[1]} 
            alt={`${associationName} property detail`} 
            aspectRatio="square"
          />
          <PropertyImage 
            url={propertyImages[2]} 
            alt={`${associationName} property view`} 
            aspectRatio="square"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AssociationPhotos;
