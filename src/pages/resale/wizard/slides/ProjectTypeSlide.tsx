
import React, { useState, useEffect } from 'react';
import { PROJECT_TYPES } from '../data/project-types';
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from '@/components/ui/skeleton';
import { debugLog, errorLog } from '@/utils/debug';
import { getFileUrl, checkFileExists } from '@/utils/supabase/storage/getUrl';

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
        // Prioritize getting access system image first
        const accessSystemImageExists = await fetchTypeImage('access_system', images);
        debugLog(`Access system image found: ${accessSystemImageExists}`);
        
        // Fetch images for each other project type
        for (const type of PROJECT_TYPES) {
          if (type.id !== 'access_system') { // Skip access_system as we already processed it
            try {
              await fetchTypeImage(type.id, images);
            } catch (imgError) {
              errorLog(`Error processing image for ${type.id}:`, imgError);
            }
          }
        }
        
        setProjectImages(images);
        debugLog('Loaded project images:', images);
      } catch (error) {
        errorLog('Error fetching project images:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectImages();
  }, []);

  // Helper function to fetch a single type image
  const fetchTypeImage = async (typeId: string, imagesObj: Record<string, string>): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .storage
        .from('project_images')
        .list(typeId, {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        });
        
      if (error) {
        errorLog(`Error fetching images for ${typeId}:`, error);
        return false;
      }
      
      if (data && data.length > 0 && !data[0].id.endsWith('/')) {
        const fileUrl = getFileUrl('project_images', `${typeId}/${data[0].name}`);
        if (fileUrl) {
          imagesObj[typeId] = fileUrl;
          debugLog(`Loaded image for ${typeId}: ${fileUrl}`);
          return true;
        }
      }
      return false;
    } catch (error) {
      errorLog(`Error in fetchTypeImage for ${typeId}:`, error);
      return false;
    }
  };

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
    
    // Show icon as fallback
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-4xl text-muted-foreground">
          {type.icon && <type.icon className="h-12 w-12" />}
        </div>
      </div>
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
