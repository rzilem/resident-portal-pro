
import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ResidentProfile } from '@/types/resident';
import ResidentTags from './ResidentTags';
import { toast } from 'sonner';

interface ProfileHeaderProps {
  resident: ResidentProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ resident }) => {
  const [tags, setTags] = useState(resident.tags || []);

  const handleTagsChange = (newTags) => {
    setTags(newTags);
    toast.success('Tags updated successfully');
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="md:w-2/5">
        <h1 className="text-2xl font-bold">{resident.name}</h1>
        
        <div className="mt-4">
          <ResidentTags tags={tags} onTagsChange={handleTagsChange} />
        </div>
        
        <div className="flex flex-col gap-2 mt-4">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            ID: {resident.id}
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            {resident.email}
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            {resident.phone}
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Move in: {resident.moveInDate}
            {resident.moveOutDate && (
              <>
                <ArrowRight className="h-4 w-4" />
                Move out: {resident.moveOutDate}
              </>
            )}
          </p>
        </div>
      </div>
      
      <div className="hidden md:block md:flex-grow"></div>
      
      <div className="flex items-center space-x-2 md:w-1/12 md:justify-end">
        <Badge 
          className={`px-3 py-1 text-sm ${
            resident.status === 'Active' 
              ? 'bg-green-100 text-green-800 hover:bg-green-100'
              : resident.status === 'Inactive' 
                ? 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                : resident.status === 'Pending' 
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                  : ''
          }`}
        >
          {resident.status}
        </Badge>
      </div>
    </div>
  );
};

export default ProfileHeader;
