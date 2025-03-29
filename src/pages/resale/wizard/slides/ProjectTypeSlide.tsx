
import React, { useState, useEffect } from 'react';
import { PROJECT_TYPES } from '../data/project-types';
import { getProjectImageUrl } from '@/utils/supabase/uploadProjectImage';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectTypeSlideProps {
  selectedType: string;
  onSelect: (typeId: string) => void;
}

const ProjectTypeSlide: React.FC<ProjectTypeSlideProps> = ({ 
  selectedType, 
  onSelect 
}) => {
  const [loading, setLoading] = useState(true);
  
  // Sort project types alphabetically by name
  const sortedProjectTypes = [...PROJECT_TYPES].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  // Simulate image loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Select Project Type</h2>
        <p className="text-muted-foreground mb-6">
          Choose the type of project you need to request bids for
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedProjectTypes.map(type => (
          <div
            key={type.id}
            className={`p-4 border rounded-md cursor-pointer transition-colors ${
              selectedType === type.id 
                ? 'bg-primary/10 border-primary' 
                : 'hover:bg-muted'
            }`}
            onClick={() => onSelect(type.id)}
          >
            <div className="flex flex-col h-full">
              {loading ? (
                <Skeleton className="w-full h-32 rounded-md mb-3" />
              ) : (
                <div className="mb-3 h-32 overflow-hidden rounded-md bg-muted">
                  {type.imagePath ? (
                    <img 
                      src={getProjectImageUrl(`${type.id}/${type.imagePath}`)} 
                      alt={type.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        e.currentTarget.style.display = 'none';
                        const iconContainer = e.currentTarget.parentElement;
                        if (iconContainer) {
                          const iconEl = document.createElement('div');
                          iconEl.className = "flex items-center justify-center h-full";
                          iconEl.innerHTML = `<div class="text-4xl text-muted-foreground">${
                            type.icon ? `<svg class="h-12 w-12" />` : ''
                          }</div>`;
                          iconContainer.appendChild(iconEl);
                          if (type.icon) {
                            const IconComponent = type.icon;
                            const iconSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                            iconSvg.setAttribute("class", "h-12 w-12");
                            iconContainer.querySelector('svg')?.replaceWith(iconSvg);
                            // Not rendering the actual icon as we can't do that in vanilla JS
                          }
                        }
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-4xl text-muted-foreground">
                        {type.icon && <type.icon className="h-12 w-12" />}
                      </div>
                    </div>
                  )}
                </div>
              )}
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
