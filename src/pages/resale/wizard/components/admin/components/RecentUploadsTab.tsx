
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import ImageCard from './ImageCard';
import { ImageItem } from '../hooks/useProjectImages';

interface RecentUploadsTabProps {
  recentUploads: ImageItem[];
  loading: boolean;
  onRefresh: () => void;
}

const RecentUploadsTab: React.FC<RecentUploadsTabProps> = ({
  recentUploads,
  loading,
  onRefresh
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Recent Uploads</h3>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recentUploads.map((image) => (
          <ImageCard 
            key={image.id} 
            image={image} 
            onDelete={() => Promise.resolve()} // No delete functionality for recent uploads tab
            showDate={true}
          />
        ))}
        
        {recentUploads.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No images uploaded recently
          </div>
        )}
      </div>
    </>
  );
};

export default RecentUploadsTab;
