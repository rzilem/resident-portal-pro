
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageUploader from '@/components/ImageUploader';
import { toast } from 'sonner';
import { Trash2, RefreshCw, Image } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface StorageImage {
  name: string;
  url: string;
  path: string;
  size: number;
  lastModified: Date;
}

const ProjectImagesManager = () => {
  const { user } = useAuth();
  const [images, setImages] = useState<StorageImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('fencing');
  
  const categories = [
    { id: 'fencing', name: 'Fencing' },
    { id: 'electrical', name: 'Electrical' },
    { id: 'plumbing', name: 'Plumbing' },
    { id: 'landscaping', name: 'Landscaping' },
  ];
  
  useEffect(() => {
    loadImages();
  }, [selectedCategory]);
  
  const loadImages = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.storage
        .from('project_images')
        .list(selectedCategory, {
          sortBy: { column: 'name', order: 'asc' }
        });
      
      if (error) {
        throw error;
      }
      
      // Get public URLs for all images
      const imageData = await Promise.all(
        data.filter(item => !item.id.endsWith('/')).map(async (item) => {
          const { data: urlData } = supabase.storage
            .from('project_images')
            .getPublicUrl(`${selectedCategory}/${item.name}`);
          
          return {
            name: item.name,
            url: urlData.publicUrl,
            path: `${selectedCategory}/${item.name}`,
            size: item.metadata?.size || 0,
            lastModified: new Date(item.metadata?.lastModified || Date.now())
          };
        })
      );
      
      setImages(imageData);
    } catch (error) {
      console.error('Error loading images:', error);
      toast.error('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImageUpload = (imageUrl: string) => {
    loadImages();
  };
  
  const handleDeleteImage = async (path: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }
    
    try {
      const { error } = await supabase.storage
        .from('project_images')
        .remove([path]);
      
      if (error) {
        throw error;
      }
      
      toast.success('Image deleted successfully');
      loadImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Image className="mr-2 h-5 w-5" />
          Project Images Manager
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!user ? (
          <p className="text-center py-4">Please log in to manage project images</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Upload New Image</h3>
              <ImageUploader 
                onUploadComplete={handleImageUpload} 
                category={selectedCategory}
              />
            </div>
            
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Current Images</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={loadImages}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            {isLoading ? (
              <div className="py-8 text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                <p>Loading images...</p>
              </div>
            ) : images.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No images found in this category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image) => (
                  <div 
                    key={image.path} 
                    className="border rounded-lg overflow-hidden flex flex-col"
                  >
                    <img 
                      src={image.url} 
                      alt={image.name}
                      className="w-full h-40 object-cover" 
                    />
                    <div className="p-2 flex-1 bg-muted/30">
                      <p className="text-sm font-medium truncate" title={image.name}>
                        {image.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Size: {Math.round(image.size / 1024)} KB
                      </p>
                    </div>
                    <div className="p-2 flex justify-between items-center border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(image.url)}
                      >
                        Copy URL
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteImage(image.path)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectImagesManager;
