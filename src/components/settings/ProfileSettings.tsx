
import React, { useEffect, useState } from 'react';
import { ensureStorageBucket } from '@/utils/supabase/ensureStorageBucket';
import { useProfileForm } from './profile/hooks/useProfileForm';
import PersonalInfoCard from './profile/cards/PersonalInfoCard';
import ProfilePhotoCard from './profile/cards/ProfilePhotoCard';

const ProfileSettings = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const {
    formData,
    profileImageUrl,
    loading,
    handleChange,
    handleSubmit,
    handlePhotoChange
  } = useProfileForm();

  // Initialize storage bucket on component mount
  useEffect(() => {
    const initStorage = async () => {
      await ensureStorageBucket('profile_photos', true);
      setIsInitialized(true);
    };
    
    initStorage();
  }, []);

  if (!isInitialized) {
    return <div>Initializing...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <PersonalInfoCard
          formData={formData}
          handleChange={handleChange}
          loading={loading}
          onSubmit={handleSubmit}
        />
        
        <ProfilePhotoCard
          profileImageUrl={profileImageUrl}
          onPhotoChange={handlePhotoChange}
        />
      </div>
    </form>
  );
};

export default ProfileSettings;
