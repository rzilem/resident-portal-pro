
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandItem,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Association } from './types';

interface AssociationListProps {
  associations: Association[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAssociationSelect: (association: Association) => void;
  onViewOwnersClick: (association: Association) => void;
}

const AssociationList: React.FC<AssociationListProps> = ({
  associations,
  searchTerm,
  onSearchChange,
  onAssociationSelect,
  onViewOwnersClick,
}) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name or location..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="border rounded-md">
        <Command>
          <CommandList>
            <CommandEmpty>No associations found</CommandEmpty>
            {associations.map((association) => (
              <CommandItem 
                key={association.id}
                onSelect={() => onAssociationSelect(association)}
                className="flex justify-between cursor-pointer"
              >
                <div>
                  <span className="font-medium">{association.name}</span>
                  <p className="text-sm text-muted-foreground">{association.location}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewOwnersClick(association);
                  }}
                >
                  View Owners
                </Button>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </div>
    </div>
  );
};

export default AssociationList;
