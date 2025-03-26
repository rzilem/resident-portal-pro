
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserRound, Image, Upload, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ProfilePhotoUploaderProps {
  initialPhotoUrl?: string | null;
  onPhotoChange: (url: string | null) => void;
}

const ProfilePhotoUploader = ({ initialPhotoUrl, onPhotoChange }: ProfilePhotoUploaderProps) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhotoUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setIsUploading(true);

    try {
      // Create a unique file path with user ID to enforce ownership
      const filePath = `${user.id}/${Date.now()}-${file.name}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('profile_photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('profile_photos')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // Update profile with new photo URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update local state
      setPhotoUrl(publicUrl);
      onPhotoChange(publicUrl);
      toast.success('Profile photo updated successfully');
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      toast.error('Failed to upload profile photo');
    } finally {
      setIsUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = async () => {
    if (!user || !photoUrl) return;

    setIsRemoving(true);

    try {
      // Extract the file path from the URL
      const filePathMatch = photoUrl.match(/profile_photos\/(.+)$/);
      if (!filePathMatch) throw new Error('Invalid file path');
      
      const filePath = filePathMatch[1];

      // Remove the file from storage
      const { error: removeError } = await supabase.storage
        .from('profile_photos')
        .remove([filePath]);

      if (removeError) throw removeError;

      // Update profile to remove the photo URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image_url: null })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update local state
      setPhotoUrl(null);
      onPhotoChange(null);
      toast.success('Profile photo removed');
    } catch (error) {
      console.error('Error removing profile photo:', error);
      toast.error('Failed to remove profile photo');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-center">
      <Avatar className="w-32 h-32 border">
        {photoUrl ? (
          <AvatarImage src={photoUrl} alt="Profile" />
        ) : null}
        <AvatarFallback className="bg-muted text-muted-foreground">
          <UserRound className="w-16 h-16" />
        </AvatarFallback>
      </Avatar>
      
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Upload a photo in JPG, PNG or GIF format. Maximum size 2MB.
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isUploading || isRemoving}
        />
        
        <div className="flex flex-wrap gap-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={handleUploadClick}
            disabled={isUploading || isRemoving}
            className="flex items-center gap-1"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Photo
              </>
            )}
          </Button>
          
          {photoUrl && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleRemovePhoto}
              disabled={isUploading || isRemoving}
              className="flex items-center gap-1 text-destructive hover:text-destructive"
            >
              {isRemoving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Remove
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoUploader;
