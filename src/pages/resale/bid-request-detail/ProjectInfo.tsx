
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { BidRequest } from '@/services/bid-request/types';
import { format } from 'date-fns';
import { PROJECT_TYPES } from '../wizard/bid-request-data';
import { supabase } from '@/integrations/supabase/client';

interface ProjectInfoProps {
  bidRequest: BidRequest;
}

interface BidRequestImage {
  id: string;
  file_path: string;
  file_name: string;
  url?: string;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ bidRequest }) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from('bid_request_images')
          .select('*')
          .eq('bid_request_id', bidRequest.id);

        if (error) {
          console.error('Error fetching project images:', error);
          return;
        }

        if (data && data.length > 0) {
          // Get URLs for each image
          const imageUrls = await Promise.all(data.map(async (image: BidRequestImage) => {
            const { data: urlData } = supabase.storage
              .from('bid_request_images')
              .getPublicUrl(image.file_path);
            
            return urlData.publicUrl;
          }));
          
          setImages(imageUrls);
        }
      } catch (error) {
        console.error('Error processing project images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [bidRequest.id]);

  const projectType = PROJECT_TYPES.find(type => type.id === bidRequest.project_type);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">
            {projectType?.name || bidRequest.project_type}
          </h3>
          
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <Clock className="h-4 w-4 mr-1" />
            Created on {format(new Date(bidRequest.created_at), 'MMM d, yyyy')}
            
            {bidRequest.due_date && (
              <span className="ml-4 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Due by {format(new Date(bidRequest.due_date), 'MMM d, yyyy')}
              </span>
            )}
          </div>
        </div>
        
        {bidRequest.notes && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-1">Notes:</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{bidRequest.notes}</p>
          </div>
        )}
        
        {/* Display project images */}
        {images.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Project Images:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((imageUrl, index) => (
                <a 
                  key={index}
                  href={imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={imageUrl}
                    alt={`Project image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md hover:opacity-90 transition-opacity"
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectInfo;
