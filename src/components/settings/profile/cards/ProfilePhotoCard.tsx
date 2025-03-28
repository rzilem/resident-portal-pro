
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProfilePhotoUploader from '../ProfilePhotoUploader';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

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
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          {/* Display avatar directly in the card for immediate feedback */}
          <Avatar className="w-32 h-32 border">
            {profileImageUrl ? (
              <AvatarImage 
                src={profileImageUrl} 
                alt="Profile" 
                className="object-cover"
                onError={(e) => {
                  console.error("Error loading profile image:", e);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : null}
            <AvatarFallback className="bg-muted text-muted-foreground">
              <UserRound className="w-16 h-16" />
            </AvatarFallback>
          </Avatar>
          
          <ProfilePhotoUploader 
            initialPhotoUrl={profileImageUrl} 
            onPhotoChange={onPhotoChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePhotoCard;
