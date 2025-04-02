
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, RefreshCw } from 'lucide-react';
import ProjectImagesManager from '../wizard/components/admin/ProjectImagesManager';
import { migrateImagesToSupabase, checkImages } from '@/utils/supabase/migrateImagesToSupabase';
import { toast } from 'sonner';
import { useAuthRole } from '@/hooks/use-auth-role';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import ResaleRbacWrapper from '@/components/resale/ResaleRbacWrapper';

const ProjectImagesPage = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [checkingImages, setCheckingImages] = useState(false);
  const { isAdmin } = useAuthRole();

  const handleMigrateImages = async () => {
    setIsMigrating(true);
    try {
      const result = await migrateImagesToSupabase();
      if (result.success) {
        if (result.uploadedCount > 0) {
          toast.success(`Successfully migrated ${result.uploadedCount} images to Supabase`);
        } else {
          toast.info('No new images needed to be migrated');
        }
      } else {
        toast.error('Failed to migrate some images to Supabase');
      }
    } catch (error) {
      console.error('Error during migration:', error);
      toast.error('An unexpected error occurred during migration');
    } finally {
      setIsMigrating(false);
    }
  };

  const handleCheckImages = async () => {
    setCheckingImages(true);
    try {
      const { allImagesAccessible, missingImages } = await checkImages();
      if (allImagesAccessible) {
        toast.success('All images are accessible in Supabase');
      } else {
        toast.error(`${missingImages.length} images are not accessible in Supabase`);
      }
    } catch (error) {
      console.error('Error checking images:', error);
      toast.error('Failed to check image accessibility');
    } finally {
      setCheckingImages(false);
    }
  };

  return (
    <ResaleRbacWrapper requiredPermission="admin">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Project Images</h1>
          <p className="text-muted-foreground mb-4">
            Manage images used in project bid requests
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              onClick={handleMigrateImages}
              disabled={isMigrating}
              className="flex items-center gap-2"
            >
              <Upload className={`h-4 w-4 ${isMigrating ? 'animate-bounce' : ''}`} />
              {isMigrating ? 'Migrating Images...' : 'Migrate Sample Images to Supabase'}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleCheckImages}
              disabled={checkingImages}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${checkingImages ? 'animate-spin' : ''}`} />
              Check Image Accessibility
            </Button>
          </div>
        </div>
        
        <ProjectImagesManager />
      </div>
    </ResaleRbacWrapper>
  );
};

export default ProjectImagesPage;
