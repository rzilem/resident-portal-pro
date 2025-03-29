
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Info, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { RecipientGroup } from './types';
import { useComposer } from './ComposerContext';
import { Badge } from '@/components/ui/badge';

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

// Mock recipient counts for each group
const recipientCountMap = {
  'all': 120,
  'property-owners': 95,
  'tenants': 25,
  'board-members': 7,
  'committee-members': 18,
  'vendors': 12,
  'invoice-approvers': 4,
  'maintenance': 6,
  'architectural': 5,
  'social': 8,
};

const RecipientSelector: React.FC = () => {
  const { selectedRecipients, setSelectedRecipients } = useComposer();

  // Effect to handle conflicts when selecting groups
  useEffect(() => {
    // If 'all' is selected, we need to ensure conflicting selections are avoided
    if (selectedRecipients.includes('all')) {
      // If 'all' was just added, filter out property-owners and tenants
      // as they would be redundant
      const conflictingGroups = ['property-owners', 'tenants'];
      const filteredRecipients = selectedRecipients.filter(
        id => !conflictingGroups.includes(id)
      );
      
      if (filteredRecipients.length !== selectedRecipients.length) {
        setSelectedRecipients(filteredRecipients);
      }
    }
  }, [selectedRecipients, setSelectedRecipients]);

  const toggleRecipientGroup = (groupId: string) => {
    // If 'all' is being selected, remove any specific property owner or tenant groups
    if (groupId === 'all') {
      setSelectedRecipients(
        selectedRecipients.includes(groupId)
          ? selectedRecipients.filter(id => id !== 'all')
          : [...selectedRecipients.filter(id => !['property-owners', 'tenants'].includes(id)), 'all']
      );
      return;
    }
    
    // For property owners and tenants, remove 'all' if it exists
    if (['property-owners', 'tenants'].includes(groupId) && selectedRecipients.includes('all')) {
      setSelectedRecipients(
        selectedRecipients.includes(groupId)
          ? selectedRecipients.filter(id => id !== groupId)
          : [...selectedRecipients.filter(id => id !== 'all'), groupId]
      );
      return;
    }
    
    // Default toggle behavior
    setSelectedRecipients(
      selectedRecipients.includes(groupId) 
        ? selectedRecipients.filter(id => id !== groupId) 
        : [...selectedRecipients, groupId]
    );
  };

  // Get estimated recipient count (with handling for overlaps)
  const getEstimatedRecipientCount = (): number => {
    if (selectedRecipients.length === 0) return 0;
    if (selectedRecipients.includes('all')) return recipientCountMap['all'];
    
    // Simple sum for demo purposes - in real app would account for overlaps
    return selectedRecipients.reduce((total, groupId) => {
      return total + (recipientCountMap[groupId as keyof typeof recipientCountMap] || 0);
    }, 0);
  };

  const recipientCount = getEstimatedRecipientCount();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="recipients">
          Recipients
          {recipientCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              ~{recipientCount} recipient{recipientCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </Label>
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
                              <p className="text-xs text-muted-foreground mt-1">
                                Approx. {recipientCountMap[group.id as keyof typeof recipientCountMap] || 0} recipients
                              </p>
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
        {selectedRecipients.length === 0 ? (
          <div className="w-full flex items-center justify-center py-2 text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
            No recipients selected
          </div>
        ) : (
          <>
            {selectedRecipients.map(groupId => {
              const group = RecipientGroups.find(g => g.id === groupId);
              const count = recipientCountMap[groupId as keyof typeof recipientCountMap] || 0;
              
              return (
                <div key={groupId} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center gap-1">
                  {group?.name}
                  <span className="text-xs text-muted-foreground ml-1">
                    (~{count})
                  </span>
                  <button 
                    type="button" 
                    className="text-primary/70 hover:text-primary ml-1"
                    onClick={() => toggleRecipientGroup(groupId)}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </>
        )}
      </div>
      {recipientCount > 50 && (
        <div className="text-sm flex items-center text-amber-500">
          <AlertTriangle className="h-4 w-4 mr-1" />
          You are sending to a large number of recipients ({recipientCount})
        </div>
      )}
      {recipientCount > 0 && recipientCount <= 50 && (
        <div className="text-sm flex items-center text-green-500">
          <CheckCircle className="h-4 w-4 mr-1" />
          {recipientCount} recipient{recipientCount !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
};

export { RecipientGroups };
export default RecipientSelector;
