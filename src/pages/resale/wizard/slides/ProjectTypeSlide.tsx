
import React from 'react';
import { PROJECT_TYPES } from '../data/project-types';
import { useProjectTypeImages } from '@/hooks/useProjectTypeImages';
import ProjectTypesGrid from '../components/ProjectTypesGrid';

interface ProjectTypeSlideProps {
  selectedType: string;
  onSelect: (typeId: string) => void;
}

const ProjectTypeSlide: React.FC<ProjectTypeSlideProps> = ({ 
  selectedType, 
  onSelect 
}) => {
  // Sort project types alphabetically by name
  const sortedProjectTypes = [...PROJECT_TYPES].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  // Use our custom hook to fetch and manage project images
  const { loading, imageErrors, projectImages, handleImageError } = useProjectTypeImages(sortedProjectTypes);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Select Project Type</h2>
        <p className="text-muted-foreground mb-6">
          Choose the type of project you need to request bids for
        </p>
      </div>
      
      <ProjectTypesGrid
        projectTypes={sortedProjectTypes}
        selectedType={selectedType}
        loading={loading}
        projectImages={projectImages}
        imageErrors={imageErrors}
        onSelect={onSelect}
        onImageError={handleImageError}
      />
    </div>
  );
};

export default ProjectTypeSlide;
