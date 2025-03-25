
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Info, Users } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { RecipientGroup } from './types';
import { useComposer } from './ComposerContext';

// Recipient groups data
const RecipientGroups: RecipientGroup[] = [
  { id: 'all', name: 'All Residents', description: 'All homeowners and tenants in the community' },
  { id: 'property-owners', name: 'Property Owners', description: 'Only homeowners in the community' },
  { id: 'tenants', name: 'Tenants', description: 'Only renters in the community' },
  { id: 'board-members', name: 'Board Members', description: 'Members of the board of directors' },
  { id: 'committee-members', name: 'Committee Members', description: 'All committee members' },
  { id: 'vendors', name: 'Vendors', description: 'Service providers and contractors' },
  { id: 'invoice-approvers', name: 'Invoice Approvers', description: 'Users with invoice approval permissions' },
  { id: 'maintenance', name: 'Maintenance Committee', description: 'Members of the maintenance committee' },
  { id: 'architectural', name: 'Architectural Committee', description: 'Members of the architectural review committee' },
  { id: 'social', name: 'Social Committee', description: 'Members of the social committee' },
];

const RecipientSelector: React.FC = () => {
  const { selectedRecipients, setSelectedRecipients } = useComposer();

  const toggleRecipientGroup = (groupId: string) => {
    setSelectedRecipients(
      selectedRecipients.includes(groupId) 
        ? selectedRecipients.filter(id => id !== groupId) 
        : [...selectedRecipients, groupId]
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="recipients">Recipients</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Users className="h-4 w-4" />
              Select Groups
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Select recipient groups</h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {RecipientGroups.map(group => (
                  <div key={group.id} className="flex items-start space-x-2">
                    <Checkbox 
                      id={`group-${group.id}`} 
                      checked={selectedRecipients.includes(group.id)} 
                      onCheckedChange={() => toggleRecipientGroup(group.id)}
                      className="mt-1"
                    />
                    <div className="flex flex-col">
                      <Label htmlFor={`group-${group.id}`} className="flex items-center">
                        {group.name}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{group.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <p className="text-xs text-muted-foreground">{group.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px]">
        {selectedRecipients.map(groupId => {
          const group = RecipientGroups.find(g => g.id === groupId);
          return (
            <div key={groupId} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center gap-1">
              {group?.name}
              <button 
                type="button" 
                className="text-primary/70 hover:text-primary"
                onClick={() => toggleRecipientGroup(groupId)}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { RecipientGroups };
export default RecipientSelector;
