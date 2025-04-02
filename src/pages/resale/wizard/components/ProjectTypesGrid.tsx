
import React from 'react';
import ProjectTypeCard from './ProjectTypeCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectTypesGridProps {
  projectTypes: any[];
  selectedType: string;
  loading: boolean;
  projectImages: Record<string, string>;
  imageErrors: Record<string, boolean>;
  onSelect: (typeId: string) => void;
  onImageError: (typeId: string) => void;
}

const ProjectTypesGrid: React.FC<ProjectTypesGridProps> = ({
  projectTypes,
  selectedType,
  loading,
  projectImages,
  imageErrors,
  onSelect,
  onImageError
}) => {
  if (loading) {
    // Show skeleton UI while loading
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={`skeleton-${index}`} className="p-4 border rounded-md">
            <div className="flex flex-col h-full">
              <Skeleton className="mb-3 h-32 w-full rounded-md" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projectTypes.map(type => (
        <ProjectTypeCard
          key={type.id}
          type={type}
          isSelected={selectedType === type.id}
          loading={loading}
          projectImages={projectImages}
          imageErrors={imageErrors}
          onSelect={onSelect}
          onImageError={onImageError}
        />
      ))}
    </div>
  );
};

export default ProjectTypesGrid;
