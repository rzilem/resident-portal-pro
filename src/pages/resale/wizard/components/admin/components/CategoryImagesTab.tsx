
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { IMAGE_CATEGORIES } from '../constants/imageCategories';
import ImageUploader from '@/components/ImageUploader';
import ImageCard from './ImageCard';
import { ImageItem } from '../hooks/useProjectImages';

interface CategoryImagesTabProps {
  category: string;
  images: ImageItem[];
  loading: boolean;
  onCategoryChange: (category: string) => void;
  onRefresh: () => void;
  onUploadComplete: (imageUrl: string) => void;
  onDelete: (imageName: string) => Promise<void>;
}

const CategoryImagesTab: React.FC<CategoryImagesTabProps> = ({
  category,
  images,
  loading,
  onCategoryChange,
  onRefresh,
  onUploadComplete,
  onDelete
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        {IMAGE_CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            variant={category === cat.id ? "default" : "outline"}
            onClick={() => onCategoryChange(cat.id)}
            className="w-full"
          >
            {cat.name}
          </Button>
        ))}
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {IMAGE_CATEGORIES.find(c => c.id === category)?.name} Images
        </h3>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload New Image</CardTitle>
          <CardDescription>
            Upload a new image to the {IMAGE_CATEGORIES.find(c => c.id === category)?.name} category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUploader
            onUploadComplete={onUploadComplete}
            category={category}
            maxSizeMB={5}
          />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <ImageCard 
            key={image.name} 
            image={image} 
            onDelete={onDelete} 
          />
        ))}
        
        {images.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No images found in this category
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryImagesTab;
