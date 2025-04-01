
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { ImageItem } from '../hooks/useProjectImages';

interface ImageCardProps {
  image: ImageItem;
  onDelete: (imageName: string) => Promise<void>;
  showDate?: boolean;
}

const ImageCard: React.FC<ImageCardProps> = ({ 
  image, 
  onDelete, 
  showDate = false 
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video overflow-hidden bg-gray-100">
        <img
          src={image.url}
          alt={image.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium truncate" title={image.name}>
              {image.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {Math.round(image.size / 1024)} KB
            </p>
            {showDate && (
              <p className="text-xs text-muted-foreground">
                {new Date(image.createdAt).toLocaleString()}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive/90"
            onClick={() => onDelete(image.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageCard;
