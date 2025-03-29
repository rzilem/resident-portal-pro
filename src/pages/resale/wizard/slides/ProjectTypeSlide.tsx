
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PROJECT_TYPES } from '../bid-request-data';

interface ProjectTypeSlideProps {
  selectedType: string;
  onSelect: (type: string) => void;
}

const ProjectTypeSlide: React.FC<ProjectTypeSlideProps> = ({ selectedType, onSelect }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Select Project Type</h2>
      <p className="text-muted-foreground mb-6">
        Choose the type of project you need bids for. This will determine the information collected.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PROJECT_TYPES.map((type) => {
          const isSelected = selectedType === type.id;
          const Icon = type.icon;
          
          return (
            <Card 
              key={type.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected 
                  ? 'ring-2 ring-primary ring-offset-2 bg-primary/5' 
                  : 'hover:bg-accent'
              }`}
              onClick={() => onSelect(type.id)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Icon className={`h-12 w-12 mb-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                <h3 className="font-medium text-lg">{type.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">{type.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectTypeSlide;
