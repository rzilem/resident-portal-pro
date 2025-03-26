
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import ProfileHeader from '@/components/residents/ProfileHeader';
import ResidentTabs from '@/components/residents/ResidentTabs';
import NotFoundState from '@/components/residents/NotFoundState';
import residentProfiles from '@/data/residentProfiles';
import { Tag } from '@/types/resident';
import { toast } from 'sonner';

const ResidentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const residentId = parseInt(id || '0');
  
  // Use state to manage resident data so tags can be updated
  const [resident, setResident] = useState(residentProfiles[residentId]);

  if (!resident) {
    return <NotFoundState />;
  }

  // Handle tag changes
  const handleTagsChange = (updatedTags: Tag[]) => {
    // Update the resident state with the new tags
    setResident(prevResident => ({
      ...prevResident,
      tags: updatedTags
    }));
    
    // In a real app, you would save this to the backend
    // console.log('Tags updated:', updatedTags);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 animate-fade-in">
      <ProfileHeader resident={resident} />
      
      <div className="flex items-center gap-2 text-muted-foreground mt-1 mb-4">
        <MapPin className="h-4 w-4" />
        <span>{resident.property} • Unit {resident.unit}</span>
      </div>
      
      <ResidentTabs resident={resident} />
    </div>
  );
};

export default ResidentProfile;
