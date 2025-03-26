
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from 'lucide-react';

interface PropertyImageProps {
  url?: string;
  alt: string;
}

const PropertyImage: React.FC<PropertyImageProps> = ({ url, alt }) => {
  return (
    <Card className="overflow-hidden">
      {url ? (
        <div className="relative aspect-video">
          <img 
            src={url} 
            alt={alt} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <CardContent className="flex flex-col items-center justify-center aspect-video bg-muted">
          <Image className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No property image available</p>
        </CardContent>
      )}
    </Card>
  );
};

export default PropertyImage;
