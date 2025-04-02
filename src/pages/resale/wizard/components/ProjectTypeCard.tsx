
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { debugLog } from '@/utils/debug';

interface ProjectTypeCardProps {
  type: any;
  isSelected: boolean;
  loading: boolean;
  projectImages: Record<string, string>;
  imageErrors: Record<string, boolean>;
  onSelect: (typeId: string) => void;
  onImageError: (typeId: string) => void;
}

const ProjectTypeCard: React.FC<ProjectTypeCardProps> = ({
  type,
  isSelected,
  loading,
  projectImages,
  imageErrors,
  onSelect,
  onImageError
}) => {
  // Add state to track local image loading
  const [isImageLoading, setIsImageLoading] = useState(true);
  
  // Reset image loading state when project images or type changes
  useEffect(() => {
    setIsImageLoading(true);
  }, [projectImages[type.id]]);
  
  // Function to get appropriate image or icon
  const renderProjectTypeImage = () => {
    if (loading) {
      return <Skeleton className="w-full h-full rounded-md" />;
    }
    
    // Check if we have a Supabase image for this type and it hasn't errored
    if (projectImages[type.id] && !imageErrors[type.id]) {
      debugLog(`Rendering image for ${type.id}: ${projectImages[type.id]}`);
      return (
        <div className="relative w-full h-full">
          {isImageLoading && <Skeleton className="absolute inset-0 rounded-md" />}
          <img 
            src={projectImages[type.id]}
            alt={type.name}
            className={`w-full h-full object-cover rounded-md ${isImageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
            onLoad={() => setIsImageLoading(false)}
            onError={() => {
              setIsImageLoading(false);
              onImageError(type.id);
            }}
          />
        </div>
      );
    }
    
    // If type-specific image failed, try the access_system fallback image
    if (projectImages['access_system'] && !imageErrors['access_system']) {
      debugLog(`Using access_system fallback for ${type.id}`);
      return (
        <div className="relative w-full h-full">
          {isImageLoading && <Skeleton className="absolute inset-0 rounded-md" />}
          <img 
            src={projectImages['access_system']}
            alt={type.name}
            className={`w-full h-full object-cover rounded-md ${isImageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
            onLoad={() => setIsImageLoading(false)}
            onError={() => {
              setIsImageLoading(false);
              onImageError('access_system');
            }}
          />
        </div>
      );
    }
    
    // Show icon as last resort if all images fail
    debugLog(`Falling back to icon for ${type.id}`);
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-4xl text-muted-foreground">
          {type.icon && <type.icon className="h-12 w-12" />}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`p-4 border rounded-md cursor-pointer transition-colors ${
        isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-muted'
      }`}
      onClick={() => onSelect(type.id)}
    >
      <div className="flex flex-col h-full">
        <div className="mb-3 h-32 overflow-hidden rounded-md bg-muted relative">
          {renderProjectTypeImage()}
        </div>
        <div>
          <h3 className="font-medium">{type.name}</h3>
          <p className="text-sm text-muted-foreground">{type.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectTypeCard;
