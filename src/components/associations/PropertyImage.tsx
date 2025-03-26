
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Image, Camera } from 'lucide-react';

interface PropertyImageProps {
  url?: string;
  alt: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'portrait';
}

const PropertyImage: React.FC<PropertyImageProps> = ({ 
  url, 
  alt, 
  className = "", 
  aspectRatio = "video" 
}) => {
  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]"
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      {url ? (
        <div className={`relative ${aspectClasses[aspectRatio]}`}>
          <img 
            src={url} 
            alt={alt} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <CardContent className={`flex flex-col items-center justify-center ${aspectClasses[aspectRatio]} bg-muted`}>
          <Camera className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No property image available</p>
        </CardContent>
      )}
    </Card>
  );
};

export default PropertyImage;
