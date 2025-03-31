
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { MergeTag } from '@/types/mergeTags';

interface MergeTagsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTag: (tag: MergeTag) => void;
}

const MERGE_TAGS: Record<string, MergeTag[]> = {
  resident: [
    { id: 'resident-name', tag: '{{resident.name}}', description: 'Full name of the resident' },
    { id: 'resident-first-name', tag: '{{resident.first_name}}', description: 'First name of the resident' },
    { id: 'resident-last-name', tag: '{{resident.last_name}}', description: 'Last name of the resident' },
    { id: 'resident-email', tag: '{{resident.email}}', description: 'Email address of the resident' },
    { id: 'resident-phone', tag: '{{resident.phone}}', description: 'Phone number of the resident' },
  ],
  property: [
    { id: 'property-address', tag: '{{property.address}}', description: 'Full property address' },
    { id: 'property-unit', tag: '{{property.unit}}', description: 'Unit number or identifier' },
    { id: 'property-type', tag: '{{property.type}}', description: 'Property type (e.g., Single Family, Condo)' },
  ],
  association: [
    { id: 'association-name', tag: '{{association.name}}', description: 'Name of the association' },
    { id: 'association-email', tag: '{{association.email}}', description: 'Contact email for the association' },
    { id: 'association-phone', tag: '{{association.phone}}', description: 'Contact phone for the association' },
    { id: 'association-website', tag: '{{association.website}}', description: 'Association website URL' },
  ],
  board: [
    { id: 'board-president', tag: '{{board.president}}', description: 'Name of the board president' },
    { id: 'board-secretary', tag: '{{board.secretary}}', description: 'Name of the board secretary' },
    { id: 'board-treasurer', tag: '{{board.treasurer}}', description: 'Name of the board treasurer' },
  ],
  financial: [
    { id: 'financial-balance', tag: '{{financial.balance}}', description: 'Current account balance' },
    { id: 'financial-due-date', tag: '{{financial.due_date}}', description: 'Next payment due date' },
    { id: 'financial-monthly-assessment', tag: '{{financial.monthly_assessment}}', description: 'Monthly assessment amount' },
    { id: 'financial-payment-methods', tag: '{{financial.payment_methods}}', description: 'Available payment methods' },
  ],
  meeting: [
    { id: 'meeting-date', tag: '{{meeting.date}}', description: 'Date of the meeting' },
    { id: 'meeting-time', tag: '{{meeting.time}}', description: 'Time of the meeting' },
    { id: 'meeting-location', tag: '{{meeting.location}}', description: 'Location of the meeting' },
    { id: 'meeting-agenda', tag: '{{meeting.agenda}}', description: 'Meeting agenda items' },
  ],
  event: [
    { id: 'event-name', tag: '{{event.name}}', description: 'Name of the event' },
    { id: 'event-date', tag: '{{event.date}}', description: 'Date of the event' },
    { id: 'event-time', tag: '{{event.time}}', description: 'Time of the event' },
    { id: 'event-location', tag: '{{event.location}}', description: 'Location of the event' },
    { id: 'event-description', tag: '{{event.description}}', description: 'Description of the event' },
  ],
};

const MergeTagsDialog: React.FC<MergeTagsDialogProps> = ({
  open,
  onOpenChange,
  onSelectTag,
}) => {
  const [activeTab, setActiveTab] = useState('resident');
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = Object.keys(MERGE_TAGS);
  
  // Filter tags based on search query across all categories
  const filteredTags = searchQuery
    ? Object.values(MERGE_TAGS)
        .flat()
        .filter((tag) =>
          tag.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tag.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : MERGE_TAGS[activeTab];
  
  const handleTagClick = (tag: MergeTag) => {
    onSelectTag(tag);
    onOpenChange(false);
  };
  
  const renderTagItem = (tag: MergeTag) => (
    <div
      key={tag.id}
      onClick={() => handleTagClick(tag)}
      className="flex flex-col p-3 rounded-md border cursor-pointer hover:bg-muted transition-colors"
    >
      <div className="font-mono text-sm">{tag.tag}</div>
      <div className="text-xs text-muted-foreground mt-1">{tag.description}</div>
    </div>
  );
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Insert Merge Tag</DialogTitle>
          <DialogDescription>
            Select a merge tag to personalize your message
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        {searchQuery ? (
          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div className="space-y-2">
              {filteredTags.length > 0 ? (
                filteredTags.map(renderTagItem)
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No tags match your search
                </div>
              )}
            </div>
          </ScrollArea>
        ) : (
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 sm:grid-cols-4 mb-2">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <TabsContent value={activeTab} className="m-0">
                <div className="space-y-2">
                  {MERGE_TAGS[activeTab]?.map(renderTagItem)}
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MergeTagsDialog;
