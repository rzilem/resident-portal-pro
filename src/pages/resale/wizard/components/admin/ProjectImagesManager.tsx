
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Upload, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ImageUploader from '@/components/ImageUploader';
import { uploadProjectImage, getProjectImageUrl } from '@/utils/supabase/uploadProjectImage';
import { supabase } from '@/integrations/supabase/client';

const ProjectImagesManager = () => {
  const [images, setImages] = useState<{ name: string; url: string; size: number; createdAt: string }[]>([]);
  const [category, setCategory] = useState('fencing');
  const [loading, setLoading] = useState(false);
  const [recentUploads, setRecentUploads] = useState<{ name: string; url: string; size: number; createdAt: string }[]>([]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      // Fetch all images from the project_images bucket
      const { data, error } = await supabase.storage
        .from('project_images')
        .list(category, {
          sortBy: { column: 'created_at', order: 'desc' }
        });
      
      if (error) {
        throw error;
      }

      // Get URLs for each image
      if (data) {
        const imageList = await Promise.all(
          data
            .filter(file => file.name !== '.emptyFolderPlaceholder')
            .map(async (file) => {
              const { data: urlData } = supabase.storage
                .from('project_images')
                .getPublicUrl(`${category}/${file.name}`);
              
              return {
                name: file.name,
                url: urlData.publicUrl,
                size: file.metadata?.size || 0,
                createdAt: file.created_at || new Date().toISOString()
              };
            })
        );
        
        setImages(imageList);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentUploads = async () => {
    setLoading(true);
    try {
      // Calculate timestamp for 30 minutes ago
      const thirtyMinutesAgo = new Date();
      thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);
      
      // Fetch all folders first
      const { data: folders } = await supabase.storage
        .from('project_images')
        .list();
      
      if (!folders) {
        return;
      }
      
      // For each folder, get files and filter for recent ones
      const allRecentFiles = [];
      
      for (const folder of folders) {
        if (folder.id) { // id property indicates it's a folder
          const { data: files } = await supabase.storage
            .from('project_images')
            .list(folder.name);
            
          if (files) {
            for (const file of files) {
              if (file.created_at && new Date(file.created_at) > thirtyMinutesAgo) {
                const { data: urlData } = supabase.storage
                  .from('project_images')
                  .getPublicUrl(`${folder.name}/${file.name}`);
                
                allRecentFiles.push({
                  name: file.name,
                  url: urlData.publicUrl,
                  size: file.metadata?.size || 0,
                  createdAt: file.created_at
                });
              }
            }
          }
        }
      }
      
      setRecentUploads(allRecentFiles);
    } catch (error) {
      console.error('Error fetching recent uploads:', error);
      toast.error('Failed to fetch recent uploads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
    fetchRecentUploads();
  }, [category]);

  const handleImageUpload = (imageUrl: string) => {
    toast.success('Image uploaded successfully');
    fetchImages();
    fetchRecentUploads();
  };

  const handleDeleteImage = async (imageName: string) => {
    try {
      const { error } = await supabase.storage
        .from('project_images')
        .remove([`${category}/${imageName}`]);
      
      if (error) {
        throw error;
      }
      
      toast.success('Image deleted successfully');
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const categories = [
    { id: 'fencing', name: 'Fencing' },
    { id: 'roofing', name: 'Roofing' },
    { id: 'landscaping', name: 'Landscaping' },
    { id: 'hvac', name: 'HVAC' },
    { id: 'plumbing', name: 'Plumbing' },
    { id: 'electrical', name: 'Electrical' }
  ];

  return (
    <Tabs defaultValue="categories">
      <TabsList className="mb-4">
        <TabsTrigger value="categories">By Category</TabsTrigger>
        <TabsTrigger value="recent">Recent Uploads</TabsTrigger>
      </TabsList>
      
      <TabsContent value="categories">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={category === cat.id ? "default" : "outline"}
              onClick={() => setCategory(cat.id)}
              className="w-full"
            >
              {cat.name}
            </Button>
          ))}
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{categories.find(c => c.id === category)?.name} Images</h3>
          <Button variant="outline" size="sm" onClick={fetchImages} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Upload New Image</CardTitle>
            <CardDescription>Upload a new image to the {categories.find(c => c.id === category)?.name} category</CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader
              onUploadComplete={handleImageUpload}
              category={category}
              maxSizeMB={5}
            />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <Card key={image.name} className="overflow-hidden">
              <div className="aspect-video overflow-hidden bg-gray-100">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm font-medium truncate" title={image.name}>
                      {image.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(image.size / 1024)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/90"
                    onClick={() => handleDeleteImage(image.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {images.length === 0 && !loading && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No images found in this category
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="recent">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Recent Uploads (Last 30 Minutes)</h3>
          <Button variant="outline" size="sm" onClick={fetchRecentUploads} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recentUploads.map((image) => (
            <Card key={image.url} className="overflow-hidden">
              <div className="aspect-video overflow-hidden bg-gray-100">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium truncate" title={image.name}>
                    {image.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(image.size / 1024)} KB
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(image.createdAt).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {recentUploads.length === 0 && !loading && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No images uploaded in the last 30 minutes
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProjectImagesManager;
