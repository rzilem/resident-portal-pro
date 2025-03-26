
import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, ArrowRight, CircleDollarSign, PhoneCall } from 'lucide-react';
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
    // In a real application, this would save to a database
    toast.success('Tags updated successfully');
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="md:w-1/3">
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
      
      {/* Financial and Contact Info */}
      <div className="md:w-1/3">
        <div className="border p-4 rounded-md bg-slate-50 dark:bg-slate-900">
          <h3 className="text-sm font-semibold mb-2">Account & Contact Info</h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <CircleDollarSign className={`h-4 w-4 mt-0.5 ${resident.balance !== '$0.00' ? 'text-red-500' : 'text-green-500'}`} />
              <div>
                <p className="text-xs font-medium">Current Balance</p>
                <p className={`text-sm font-bold ${resident.balance !== '$0.00' ? 'text-red-600' : 'text-green-600'}`}>
                  {resident.balance}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <PhoneCall className="h-4 w-4 mt-0.5 text-indigo-500" />
              <div>
                <p className="text-xs font-medium">Last Contact</p>
                {resident.lastContact && (
                  <>
                    {resident.lastContact.called && (
                      <p className="text-xs">
                        <span className="font-medium">Called:</span> {resident.lastContact.called}
                      </p>
                    )}
                    {resident.lastContact.visitedOffice && (
                      <p className="text-xs">
                        <span className="font-medium">Office Visit:</span> {resident.lastContact.visitedOffice}
                      </p>
                    )}
                    {resident.lastContact.email && (
                      <p className="text-xs">
                        <span className="font-medium">Email:</span> {resident.lastContact.email}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 md:w-1/6 md:justify-end">
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
