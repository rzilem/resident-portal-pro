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
  const { photos, isLoading, error } = useAssociationPhotos(associationId);

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

  // If error, show error state
  if (error) {
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
            <Image className="h-12 w-12 text-destructive opacity-70" />
            <p className="text-destructive">Error loading photos: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no photos, show a placeholder
  if (!photos || photos.length === 0) {
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
            {photos.map((photo) => {
              // Always use the original URL without replacing demo URLs
              const imageUrl = photo.url;
                
              console.log(`Rendering photo: ${photo.id} with URL: ${imageUrl}`);
              
              return (
                <CarouselItem key={photo.id}>
                  <div className="overflow-hidden rounded-md">
                    <img 
                      src={imageUrl} 
                      alt={photo.description || `${associationName} property`} 
                      className="h-[250px] w-full object-cover"
                      onError={(e) => {
                        console.error("Failed to load image:", imageUrl);
                        e.currentTarget.src = "https://placehold.co/600x400?text=Image+Not+Found";
                      }}
                    />
                  </div>
                  {photo.description && (
                    <p className="text-sm text-center mt-2 text-muted-foreground">{photo.description}</p>
                  )}
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="-left-3" />
          <CarouselNext className="-right-3" />
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default AssociationPhotos;
