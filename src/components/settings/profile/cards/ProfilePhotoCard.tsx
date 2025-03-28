
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProfilePhotoUploader from '../ProfilePhotoUploader';

interface ProfilePhotoCardProps {
  profileImageUrl: string | null;
  onPhotoChange: (url: string | null) => void;
}

const ProfilePhotoCard = ({ profileImageUrl, onPhotoChange }: ProfilePhotoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Photo</CardTitle>
        <CardDescription>Update your profile picture</CardDescription>
      </CardHeader>
      <CardContent>
        <ProfilePhotoUploader 
          initialPhotoUrl={profileImageUrl} 
          onPhotoChange={onPhotoChange}
        />
      </CardContent>
    </Card>
  );
};

export default ProfilePhotoCard;
