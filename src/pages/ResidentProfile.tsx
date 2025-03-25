
import React from 'react';
import { useParams } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import ProfileHeader from '@/components/residents/ProfileHeader';
import ResidentTabs from '@/components/residents/ResidentTabs';
import NotFoundState from '@/components/residents/NotFoundState';
import residentProfiles from '@/data/residentProfiles';

const ResidentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const residentId = parseInt(id || '0');
  const resident = residentProfiles[residentId];

  if (!resident) {
    return <NotFoundState />;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 animate-fade-in">
      <ProfileHeader resident={resident} />
      
      <div className="flex items-center gap-2 text-muted-foreground mt-1 mb-6">
        <MapPin className="h-4 w-4" />
        <span>{resident.property} • Unit {resident.unit}</span>
      </div>
      
      <ResidentTabs resident={resident} />
    </div>
  );
};

export default ResidentProfile;
