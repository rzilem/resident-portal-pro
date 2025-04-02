
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthProvider';

export const useProfilePhoto = (initialPhotoUrl: string | null, onPhotoChange: (url: string | null) => void) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhotoUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { user } = useAuth();

  const handleFileUpload = async (file: File) => {
    if (!user) {
      toast.error('You must be logged in to upload a profile photo');
      return;
    }

    // File size validation (2MB)
    const fileSize = file.size / 1024 / 1024;
    if (fileSize > 2) {
      toast.error('File size exceeds 2MB limit');
      return;
    }

    // File type validation
    const fileType = file.type;
    if (!fileType.match(/image\/(jpeg|jpg|png|gif)/)) {
      toast.error('Unsupported file type. Please upload a JPG, PNG, or GIF');
      return;
    }

    setIsUploading(true);

    try {
      // Create a unique filename using user ID and timestamp
      const fileExtension = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExtension}`;
      const filePath = `profile_photos/${fileName}`;

      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('profile_photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('profile_photos')
        .getPublicUrl(filePath);

      const newPhotoUrl = urlData.publicUrl;
      
      // Update the URL in state and parent component
      setPhotoUrl(newPhotoUrl);
      onPhotoChange(newPhotoUrl);

      // Update the user's profile in the database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image_url: newPhotoUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success('Profile photo updated successfully');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload profile photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!user || !photoUrl) return;

    setIsRemoving(true);

    try {
      // Extract the file path from the URL
      const urlPath = photoUrl.split('/').slice(-2).join('/');
      
      // Delete the file from storage
      const { error } = await supabase.storage
        .from('profile_photos')
        .remove([urlPath]);

      if (error) throw error;

      // Update the URL in state and parent component
      setPhotoUrl(null);
      onPhotoChange(null);

      // Update the user's profile in the database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image_url: null })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success('Profile photo removed');
    } catch (error) {
      console.error('Error removing photo:', error);
      toast.error('Failed to remove profile photo');
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
