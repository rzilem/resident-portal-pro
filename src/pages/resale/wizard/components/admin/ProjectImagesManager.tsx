
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useProjectImages } from './hooks/useProjectImages';
import CategoryImagesTab from './components/CategoryImagesTab';
import RecentUploadsTab from './components/RecentUploadsTab';
import { useAuthRole } from '@/hooks/use-auth-role';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

const ProjectImagesManager: React.FC = () => {
  const {
    images,
    category,
    loading,
    recentUploads,
    setCategory,
    fetchImages,
    fetchRecentUploads,
    handleDeleteImage
  } = useProjectImages();

  const { isAdmin, loading: roleLoading } = useAuthRole();

  const handleImageUpload = (imageUrl: string) => {
    toast.success('Image uploaded successfully');
    fetchImages();
    fetchRecentUploads();
  };

  if (roleLoading) {
    return <div className="p-8 text-center">Loading permissions...</div>;
  }

  if (!isAdmin) {
    return (
      <Alert variant="destructive" className="my-4">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          This section is only accessible to administrators.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Tabs defaultValue="categories">
      <TabsList className="mb-4">
        <TabsTrigger value="categories">By Category</TabsTrigger>
        <TabsTrigger value="recent">Recent Uploads</TabsTrigger>
      </TabsList>
      
      <TabsContent value="categories">
        <CategoryImagesTab
          category={category}
          images={images}
          loading={loading}
          onCategoryChange={setCategory}
          onRefresh={fetchImages}
          onUploadComplete={handleImageUpload}
          onDelete={handleDeleteImage}
        />
      </TabsContent>
      
      <TabsContent value="recent">
        <RecentUploadsTab
          recentUploads={recentUploads}
          loading={loading}
          onRefresh={fetchRecentUploads}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProjectImagesManager;
