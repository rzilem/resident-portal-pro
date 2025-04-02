
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { debugLog, errorLog } from '@/utils/debug';
import { getFileUrl } from '@/utils/supabase/storage/getUrl';
import { toast } from 'sonner';

export const useProjectTypeImages = (projectTypes: any[]) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [projectImages, setProjectImages] = useState<Record<string, string>>({});
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(Date.now());

  // Create a refreshImages method that can be called to force a refresh
  const refreshImages = useCallback(() => {
    setLastRefreshTime(Date.now());
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const fetchProjectImages = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      const images: Record<string, string> = {};
      
      try {
        // Reset error state when refreshing
        setImageErrors({});
        
        // Always prioritize getting access_system image first as a fallback
        debugLog('Fetching access_system image first as fallback');
        await fetchTypeImage('access_system', images);
        
        // Fetch images for each project type
        for (const type of projectTypes) {
          if (type.id !== 'access_system') { // Skip access_system as we already processed it
            await fetchTypeImage(type.id, images);
          }
        }
        
        if (isMounted) {
          setProjectImages(images);
          debugLog('Loaded project images:', images);
        }
      } catch (error) {
        errorLog('Error fetching project images:', error);
        if (isMounted) {
          toast.error('Failed to load project images');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchProjectImages();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [projectTypes, lastRefreshTime]); // Added lastRefreshTime as a dependency

  // Helper function to fetch a single type image
  const fetchTypeImage = async (typeId: string, imagesObj: Record<string, string>): Promise<boolean> => {
    try {
      debugLog(`Fetching images for ${typeId}...`);
      
      const { data, error } = await supabase
        .storage
        .from('project_images')
        .list(typeId, {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        });
      
      if (error) {
        errorLog(`Error listing files for ${typeId}:`, error);
        return false;
      }
      
      debugLog(`Files found in ${typeId}:`, data);
      
      if (data && data.length > 0) {
        // Filter out folders (entries ending with '/')
        const files = data.filter(item => !item.name.endsWith('/'));
        
        if (files.length > 0) {
          const filePath = `${typeId}/${files[0].name}`;
          debugLog(`Using file path: ${filePath}`);
          
          // Get public URL for the file with cache busting to prevent flashing
          const fileUrl = getFileUrl('project_images', filePath, { cacheBuster: true });
          
          if (fileUrl) {
            imagesObj[typeId] = fileUrl;
            debugLog(`Loaded image for ${typeId}: ${fileUrl}`);
            return true;
          } else {
            errorLog(`Failed to get URL for ${filePath}`);
          }
        } else {
          debugLog(`No valid files found in ${typeId}`);
        }
      } else {
        debugLog(`No data returned for ${typeId}`);
      }
      
      return false;
    } catch (error) {
      errorLog(`Error in fetchTypeImage for ${typeId}:`, error);
      return false;
    }
  };

  const handleImageError = useCallback((typeId: string) => {
    debugLog(`Image error for type: ${typeId}`);
    setImageErrors(prev => ({ ...prev, [typeId]: true }));
    
    // Show a toast only once per session (not for every image)
    if (!sessionStorage.getItem('image-error-shown')) {
      toast.error('Some project type images could not be loaded', {
        description: 'Using fallback images instead'
      });
      sessionStorage.setItem('image-error-shown', 'true');
    }
  }, []);

  return { loading, imageErrors, projectImages, handleImageError, refreshImages };
};
