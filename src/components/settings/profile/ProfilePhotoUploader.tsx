
import React from 'react';
import AvatarDisplay from './AvatarDisplay';
import UploadControls from './UploadControls';
import { useProfilePhoto } from './hooks/useProfilePhoto';

interface ProfilePhotoUploaderProps {
  initialPhotoUrl?: string | null;
  onPhotoChange: (url: string | null) => void;
}

const ProfilePhotoUploader = ({ initialPhotoUrl, onPhotoChange }: ProfilePhotoUploaderProps) => {
  const {
    photoUrl,
    isUploading,
    isRemoving,
    handleFileUpload,
    handleRemovePhoto
  } = useProfilePhoto(initialPhotoUrl || null, onPhotoChange);

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-center">
      <AvatarDisplay photoUrl={photoUrl} size="lg" />
      
      <UploadControls
        photoUrl={photoUrl}
        isUploading={isUploading}
        isRemoving={isRemoving}
        onFileSelected={handleFileUpload}
        onRemovePhoto={handleRemovePhoto}
      />
    </div>
  );
};

export default ProfilePhotoUploader;
