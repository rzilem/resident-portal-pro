
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { SAMPLE_COMMUNITIES } from '../types';

interface CommunitiesSelectorProps {
  selectedCommunities: string[];
  onToggleCommunity: (communityId: string) => void;
}

const CommunitiesSelector: React.FC<CommunitiesSelectorProps> = ({
  selectedCommunities,
  onToggleCommunity
}) => {
  return (
    <div className="space-y-2">
      <Label>Available Communities</Label>
      <div className="border rounded-md p-3 space-y-2">
        {SAMPLE_COMMUNITIES.map(community => (
          <div className="flex items-center space-x-2" key={community.id}>
            <Checkbox 
              id={`community-${community.id}`} 
              checked={selectedCommunities.includes(community.id)}
              onCheckedChange={() => onToggleCommunity(community.id)}
            />
            <Label htmlFor={`community-${community.id}`} className="cursor-pointer">
              {community.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunitiesSelector;
