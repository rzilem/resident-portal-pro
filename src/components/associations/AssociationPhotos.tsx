
import React from 'react';
import { Image, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext
} from '@/components/ui/carousel';

interface AssociationPhotosProps {
  associationName: string;
  propertyImages: string[];
}

const AssociationPhotos: React.FC<AssociationPhotosProps> = ({ associationName, propertyImages }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Image className="h-5 w-5" />
          Property Photos
        </CardTitle>
        <CardDescription>{associationName} property images</CardDescription>
      </CardHeader>
      <CardContent>
        <Carousel className="w-full">
          <CarouselContent>
            {propertyImages.map((url, index) => (
              <CarouselItem key={index}>
                <div className="overflow-hidden rounded-md">
                  <img 
                    src={url} 
                    alt={`${associationName} property ${index + 1}`} 
                    className="h-[250px] w-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-3" />
          <CarouselNext className="-right-3" />
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default AssociationPhotos;
