
import React from 'react';
import { PROJECT_TYPES } from '../bid-request-data';

interface ProjectTypeSlideProps {
  selectedType: string;
  onSelect: (typeId: string) => void;
}

const ProjectTypeSlide: React.FC<ProjectTypeSlideProps> = ({ 
  selectedType, 
  onSelect 
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Select Project Type</h2>
        <p className="text-muted-foreground mb-6">
          Choose the type of project you need to request bids for
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROJECT_TYPES.map(type => (
          <div
            key={type.id}
            className={`p-4 border rounded-md cursor-pointer transition-colors ${
              selectedType === type.id 
                ? 'bg-primary/10 border-primary' 
                : 'hover:bg-muted'
            }`}
            onClick={() => onSelect(type.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">
                {type.icon && <type.icon className="h-6 w-6" />}
              </div>
              <div>
                <h3 className="font-medium">{type.name}</h3>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTypeSlide;
