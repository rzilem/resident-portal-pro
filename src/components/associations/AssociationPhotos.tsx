
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
import { useAssociationPhotos } from '@/hooks/useAssociationPhotos';

interface AssociationPhotosProps {
  associationId: string;
  associationName: string;
}

const AssociationPhotos: React.FC<AssociationPhotosProps> = ({ associationId, associationName }) => {
  const { photos, isLoading } = useAssociationPhotos(associationId);

  // If loading, show a loading state
  if (isLoading) {
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
          <div className="h-[250px] flex items-center justify-center">
            <div className="animate-pulse h-full w-full bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no photos, show a placeholder
  if (photos.length === 0) {
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
          <div className="h-[250px] flex items-center justify-center flex-col text-center gap-2 bg-muted/30 rounded-md">
            <Image className="h-12 w-12 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No photos available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Use real photos from the database
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
            {photos.map((photo) => (
              <CarouselItem key={photo.id}>
                <div className="overflow-hidden rounded-md">
                  <img 
                    src={photo.url} 
                    alt={photo.description || `${associationName} property`} 
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
