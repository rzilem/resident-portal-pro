
import React from 'react';
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
    <div>
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
