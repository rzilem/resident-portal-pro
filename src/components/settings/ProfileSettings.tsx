
import React, { useEffect, useState } from 'react';
import { ensureStorageBucket } from '@/utils/supabase/ensureStorageBucket';
import { useProfileForm } from './profile/hooks/useProfileForm';
import PersonalInfoCard from './profile/cards/PersonalInfoCard';
import ProfilePhotoCard from './profile/cards/ProfilePhotoCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ProfileSettings = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const {
    formData,
    profileImageUrl,
    loading,
    handleChange,
    handleSubmit,
    handlePhotoChange,
    isAdmin
  } = useProfileForm();

  // Initialize storage bucket on component mount with error handling
  useEffect(() => {
    const initStorage = async () => {
      try {
        // Try to create bucket through normal API first
        const bucketCreated = await ensureStorageBucket('profile_photos', true);
        
        if (!bucketCreated) {
          console.log("Failed to create bucket through normal API, checking if it exists...");
          
          // Check if the bucket already exists
          const { data: buckets, error: listError } = await supabase.storage.listBuckets();
          
          if (listError) {
            console.error("Error listing buckets:", listError);
          } else {
            const bucketExists = buckets.some(bucket => bucket.name === 'profile_photos');
            
            if (bucketExists) {
              console.log("Bucket 'profile_photos' already exists, proceeding...");
              setIsInitialized(true);
              return;
            }
          }
          
          // If we get here, the bucket doesn't exist and we couldn't create it
          console.error("Could not create or find the profile_photos bucket");
          toast.error("Could not initialize photo storage. Some features may be limited.");
        }
      } catch (error) {
        console.error("Error initializing storage:", error);
        toast.error("Could not initialize photo storage. Some features may be limited.");
      }
      
      // Proceed with initialization even if there was an error
      setIsInitialized(true);
    };
    
    initStorage();
  }, []);

  if (!isInitialized) {
    return <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      <span className="ml-3">Initializing...</span>
    </div>;
  }

  // Create a compatible form object that provides the necessary methods
  // to work with our PersonalInfoCard component
  const formAdapter = {
    getValues: (field: string) => {
      if (field === 'firstName') return formData.name.split(' ')[0] || '';
      if (field === 'lastName') {
        const nameParts = formData.name.split(' ');
        return nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      }
      if (field === 'email') return formData.email;
      if (field === 'phoneNumber') return formData.phone;
      if (field === 'address') return formData.address;
      if (field === 'bio') return formData.bio;
      return '';
    },
    setValue: (field: string, value: string) => {
      if (field === 'firstName') {
        const lastName = formData.name.split(' ').slice(1).join(' ');
        handleChange({
          target: { name: 'name', value: `${value} ${lastName}`.trim() }
        } as React.ChangeEvent<HTMLInputElement>);
      } else if (field === 'lastName') {
        const firstName = formData.name.split(' ')[0] || '';
        handleChange({
          target: { name: 'name', value: `${firstName} ${value}`.trim() }
        } as React.ChangeEvent<HTMLInputElement>);
      } else {
        handleChange({
          target: { name: field, value }
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <PersonalInfoCard
          form={formAdapter}
          isAdmin={isAdmin}
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
