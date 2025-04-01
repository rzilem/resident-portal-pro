
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TooltipButton } from '@/components/ui/tooltip-button';

interface ProjectImageGalleryProps {
  images: string[];
  onDeleteImage: (index: number) => void;
}

const ProjectImageGallery: React.FC<ProjectImageGalleryProps> = ({
  images,
  onDeleteImage
}) => {
  if (images.length === 0) {
    return null;
  }
  
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Project Images</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Project image ${index + 1}`}
                className="w-full h-32 object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <TooltipButton
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onDeleteImage(index)}
                  tooltipText="Remove this image"
                >
                  <Trash2 className="h-4 w-4" />
                </TooltipButton>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectImageGallery;
