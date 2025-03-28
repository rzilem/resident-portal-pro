
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthProvider';

export const useProfilePhoto = (
  initialPhotoUrl: string | null, 
  onPhotoChange: (url: string | null) => void
) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhotoUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { user } = useAuth();

  // Update local state when initialPhotoUrl changes from parent component
  useEffect(() => {
    if (initialPhotoUrl !== photoUrl) {
      setPhotoUrl(initialPhotoUrl || null);
    }
  }, [initialPhotoUrl]);

  const handleFileUpload = async (file: File) => {
    if (!file || !user) {
      console.log("No file selected or user not logged in");
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setIsUploading(true);

    try {
      console.log("Starting file upload process");
      const filePath = `${user.id}/${Date.now()}-${file.name}`;

      const { data, error } = await supabase.storage
        .from('profile_photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error("Storage upload error:", error);
        throw error;
      }

      console.log("File uploaded successfully:", data);

      const { data: publicUrlData } = supabase.storage
        .from('profile_photos')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;
      console.log("Public URL generated:", publicUrl);

      // First update local state to show image immediately
      setPhotoUrl(publicUrl);

      // Update the profile in the database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error("Profile update error:", updateError);
        throw updateError;
      }

      // Call onPhotoChange callback after successful update
      onPhotoChange(publicUrl);
      toast.success('Profile photo updated successfully');
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      toast.error('Failed to upload profile photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!user || !photoUrl) return;

    setIsRemoving(true);

    try {
      const filePathMatch = photoUrl.match(/profile_photos\/(.+)$/);
      if (!filePathMatch) throw new Error('Invalid file path');
      
      const filePath = filePathMatch[1];
      console.log("Removing file:", filePath);

      // First update local state to show changes immediately
      setPhotoUrl(null);

      // Update the profile in the database first
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image_url: null })
        .eq('id', user.id);

      if (updateError) {
        console.error("Profile update error:", updateError);
        throw updateError;
      }

      // Then try to remove the file from storage
      const { error: removeError } = await supabase.storage
        .from('profile_photos')
        .remove([filePath]);

      if (removeError) {
        console.error("Storage remove error:", removeError);
        // Don't throw error here, still update profile even if storage remove fails
      }

      onPhotoChange(null);
      toast.success('Profile photo removed');
    } catch (error) {
      console.error('Error removing profile photo:', error);
      toast.error('Failed to remove profile photo');
      // Restore photoUrl if operation fails
      setPhotoUrl(photoUrl);
    } finally {
      setIsRemoving(false);
    }
  };

  return {
    photoUrl,
    isUploading,
    isRemoving,
    handleFileUpload,
    handleRemovePhoto
  };
};
