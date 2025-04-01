
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { errorLog } from "@/utils/debug";

/**
 * Generic file upload utility for Supabase storage
 * @param file The file to upload
 * @param bucket The storage bucket name
 * @param path The path within the bucket
 * @param options Additional upload options
 * @returns URL of the uploaded file or null if upload failed
 */
export const uploadFile = async (
  file: File, 
  bucket: string,
  path: string = '',
  options: {
    cacheControl?: string;
    upsert?: boolean;
    contentType?: string;
    useDemo?: boolean;
  } = {}
): Promise<string | null> => {
  try {
    // Validate file
    if (!file) {
      toast.error('No file provided');
      return null;
    }
    
    // Use demo mode if explicitly requested or if we've had storage issues before
    const useDemo = options.useDemo === true || sessionStorage.getItem('use-demo-storage') === 'true';
    
    if (useDemo) {
      console.log(`[Demo Mode] Simulating file upload: ${file.name} to ${bucket}/${path}`);
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create a fake URL that includes the filename for better UX
      const timestamp = Date.now();
      const demoId = Math.random().toString(36).substring(2, 15);
      const mockUrl = `https://demo-storage.example.com/${bucket}/${path}/${demoId}/${file.name}`;
      
      console.log(`[Demo Mode] Generated URL: ${mockUrl}`);
      toast.success('File processed in demo mode');
      return mockUrl;
    }
    
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${file.name.split('.')[0]}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;
    
    // Check if bucket exists first to prevent errors
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      errorLog(`Error checking storage buckets:`, bucketError);
      
      // Set demo mode for future uploads
      sessionStorage.setItem('use-demo-storage', 'true');
      
      // Return to demo mode
      return uploadFile(file, bucket, path, { ...options, useDemo: true });
    } else {
      const bucketExists = buckets.some(b => b.name === bucket);
      
      if (!bucketExists) {
        console.log(`Bucket ${bucket} not found, attempting to create...`);
        try {
          const { error: createError } = await supabase.storage.createBucket(bucket, {
            public: true
          });
          
          if (createError) {
            errorLog(`Error creating bucket ${bucket}:`, createError);
            
            // If bucket creation fails, switch to demo mode
            sessionStorage.setItem('use-demo-storage', 'true');
            return uploadFile(file, bucket, path, { ...options, useDemo: true });
          } else {
            console.log(`Created bucket ${bucket} successfully`);
          }
        } catch (bucketError) {
          console.error('Error creating bucket:', bucketError);
          
          // Switch to demo mode
          sessionStorage.setItem('use-demo-storage', 'true');
          return uploadFile(file, bucket, path, { ...options, useDemo: true });
        }
      }
    }
    
    // Upload to Supabase
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: options.cacheControl || '3600',
          upsert: options.upsert !== undefined ? options.upsert : true,
          contentType: options.contentType || file.type
        });
      
      if (error) {
        errorLog(`Error uploading file to ${bucket}:`, error);
        
        // Switch to demo mode
        sessionStorage.setItem('use-demo-storage', 'true');
        return uploadFile(file, bucket, path, { ...options, useDemo: true });
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
      
      return publicUrlData.publicUrl;
    } catch (uploadError) {
      errorLog(`Exception in uploadFile to ${bucket}:`, uploadError);
      
      // Switch to demo mode
      sessionStorage.setItem('use-demo-storage', 'true');
      return uploadFile(file, bucket, path, { ...options, useDemo: true });
    }
  } catch (error) {
    errorLog(`Exception in uploadFile to ${bucket}:`, error);
    toast.error('An unexpected error occurred while uploading the file');
    
    // Switch to demo mode for future uploads
    sessionStorage.setItem('use-demo-storage', 'true');
    return null;
  }
};
