
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useComposer } from './ComposerContext';

// Sample community data
const SAMPLE_COMMUNITIES = [
  { id: 'comm1', name: 'Riverside HOA' },
  { id: 'comm2', name: 'Oakwood Condos' },
  { id: 'comm3', name: 'Mountain View Estates' },
  { id: 'comm4', name: 'Harbor Point' },
];

interface CommunitySelectorProps {
  onCommunityChange?: (communityId: string) => void;
}

const CommunitySelector: React.FC<CommunitySelectorProps> = ({ onCommunityChange }) => {
  const { selectedCommunity, setSelectedCommunity } = useComposer();

  const handleCommunityChange = (value: string) => {
    setSelectedCommunity(value);
    if (onCommunityChange) {
      onCommunityChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="community">Community</Label>
      <Select 
        value={selectedCommunity} 
        onValueChange={handleCommunityChange}
      >
        <SelectTrigger id="community">
          <SelectValue placeholder="Select a community" />
        </SelectTrigger>
        <SelectContent>
          {SAMPLE_COMMUNITIES.map(community => (
            <SelectItem key={community.id} value={community.id}>
              {community.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export { SAMPLE_COMMUNITIES };
export default CommunitySelector;
