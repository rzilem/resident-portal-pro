
import React, { useState, useEffect } from 'react';
import { PROJECT_TYPES } from '../data/project-types';
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from '@/components/ui/skeleton';
import { debugLog } from '@/utils/debug';

interface ProjectTypeSlideProps {
  selectedType: string;
  onSelect: (typeId: string) => void;
}

const ProjectTypeSlide: React.FC<ProjectTypeSlideProps> = ({ 
  selectedType, 
  onSelect 
}) => {
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [projectImages, setProjectImages] = useState<Record<string, string>>({});
  
  // Sort project types alphabetically by name
  const sortedProjectTypes = [...PROJECT_TYPES].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  // Fetch project images from Supabase
  useEffect(() => {
    const fetchProjectImages = async () => {
      setLoading(true);
      const images: Record<string, string> = {};
      
      try {
        // Fetch images for each project type
        for (const type of PROJECT_TYPES) {
          const { data, error } = await supabase
            .storage
            .from('project_images')
            .list(type.id, {
              limit: 1,
              sortBy: { column: 'created_at', order: 'desc' }
            });
            
          if (error) {
            console.error(`Error fetching images for ${type.id}:`, error);
            continue;
          }
          
          if (data && data.length > 0 && !data[0].id.endsWith('/')) {
            const { data: urlData } = supabase.storage
              .from('project_images')
              .getPublicUrl(`${type.id}/${data[0].name}`);
              
            images[type.id] = urlData.publicUrl;
          }
        }
        
        setProjectImages(images);
      } catch (error) {
        console.error('Error fetching project images:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectImages();
  }, []);

  const handleImageError = (typeId: string) => {
    debugLog(`Image error for type: ${typeId}`);
    setImageErrors(prev => ({ ...prev, [typeId]: true }));
  };

  // Function to get appropriate image or icon
  const renderProjectTypeImage = (type: any) => {
    if (loading) {
      return <Skeleton className="w-full h-full rounded-md" />;
    }
    
    // Check if we have a Supabase image for this type
    if (projectImages[type.id] && !imageErrors[type.id]) {
      return (
        <img 
          src={projectImages[type.id]}
          alt={type.name}
          className="w-full h-full object-cover"
          onError={() => handleImageError(type.id)}
        />
      );
    }
    
    // Specifically handle arborist image with direct path
    if (type.id === 'arborist') {
      return (
        <img 
          src="/lovable-uploads/f882aa65-6796-4e85-85b6-1d4961276334.png" 
          alt={type.name}
          className="w-full h-full object-cover"
          onError={() => handleImageError(type.id)}
        />
      );
    }
    
    // Show icon as fallback
    if (!type.imagePath || imageErrors[type.id]) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-4xl text-muted-foreground">
            {type.icon && <type.icon className="h-12 w-12" />}
          </div>
        </div>
      );
    }
    
    // Use the uploaded image from Supabase or fallback
    return (
      <img 
        src={type.imagePath} 
        alt={type.name}
        className="w-full h-full object-cover"
        onError={() => handleImageError(type.id)}
      />
    );
  };

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
              <div className="mb-3 h-32 overflow-hidden rounded-md bg-muted relative">
                {renderProjectTypeImage(type)}
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
