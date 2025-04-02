
import React from 'react';
import ProjectTypeCard from './ProjectTypeCard';

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
