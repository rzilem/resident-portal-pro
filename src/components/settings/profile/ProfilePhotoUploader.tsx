
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserRound, Image, Upload, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthProvider';

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

  // Update local state when initialPhotoUrl changes from parent component
  useEffect(() => {
    if (initialPhotoUrl !== photoUrl) {
      setPhotoUrl(initialPhotoUrl || null);
    }
  }, [initialPhotoUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

      const { error: removeError } = await supabase.storage
        .from('profile_photos')
        .remove([filePath]);

      if (removeError) {
        console.error("Storage remove error:", removeError);
        // Don't throw error here, still update profile even if storage remove fails
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image_url: null })
        .eq('id', user.id);

      if (updateError) {
        console.error("Profile update error:", updateError);
        throw updateError;
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
