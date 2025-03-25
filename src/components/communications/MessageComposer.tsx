
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Users, Copy, Info, Tag as TagIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import HtmlEditor from './HtmlEditor';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import MergeTagsDialog from './MergeTagsDialog';
import { MergeTag } from '@/types/mergeTags';
import { mergeTagService } from '@/services/mergeTagService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface MessageComposerProps {
  onSendMessage: (message: { subject: string; content: string; recipients: string[] }) => void;
  initialSubject?: string;
  initialContent?: string;
}

const RecipientGroups = [
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
]

const MessageComposer: React.FC<MessageComposerProps> = ({ 
  onSendMessage,
  initialSubject = '',
  initialContent = '',
}) => {
  const [subject, setSubject] = useState(initialSubject);
  const [content, setContent] = useState(initialContent);
  const [format, setFormat] = useState<'plain' | 'html'>('html');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>(['all']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [isMergeTagsDialogOpen, setIsMergeTagsDialogOpen] = useState(false);
  const [showMergeTagPreview, setShowMergeTagPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim()) {
      alert('Please enter a subject');
      return;
    }
    
    if (!content.trim()) {
      alert('Please enter a message');
      return;
    }

    setIsSubmitting(true);
    
    try {
      onSendMessage({
        subject,
        content,
        recipients: selectedRecipients,
      });
      
      // Reset form after successful submission
      setSubject('');
      setContent('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRecipientGroup = (groupId: string) => {
    setSelectedRecipients(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId) 
        : [...prev, groupId]
    );
  };

  const handleInsertMergeTag = (tag: MergeTag) => {
    // Handle differently based on plain text vs HTML
    if (format === 'plain') {
      setContent(prev => prev + ' ' + tag.tag + ' ');
    } else {
      // For HTML editor, we'll need to have the editor provide a method to insert at cursor
      // For now, we'll just append it
      setContent(prev => prev + ' ' + tag.tag + ' ');
    }
  };

  const handlePreviewWithMergeTags = async () => {
    // Process the content with merge tags
    const processed = await mergeTagService.processMergeTags(content, {
      // In a real app, you'd pass the actual context data here
    });
    
    setPreviewContent(processed);
    setShowMergeTagPreview(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-6">
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

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter message subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="content">Message Content</Label>
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsMergeTagsDialogOpen(true)}
                >
                  <TagIcon className="mr-2 h-4 w-4" />
                  Insert Merge Tag
                </Button>
                <Select 
                  value={format} 
                  onValueChange={(value) => setFormat(value as 'plain' | 'html')}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Message Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plain">Plain Text</SelectItem>
                    <SelectItem value="html">Rich HTML</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {format === 'plain' ? (
              <Textarea
                id="content"
                placeholder="Enter your message"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[250px]"
                required
              />
            ) : (
              <Card className="border">
                <HtmlEditor 
                  value={content} 
                  onChange={setContent}
                />
              </Card>
            )}

            <div className="flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handlePreviewWithMergeTags}
              >
                Preview with Merge Tags
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="scheduled"
                checked={isScheduled}
                onCheckedChange={(checked) => setIsScheduled(checked === true)}
              />
              <Label htmlFor="scheduled">Schedule message for later</Label>
            </div>
            
            {isScheduled && (
              <div className="pl-6">
                <Label htmlFor="scheduledDate">Date and time</Label>
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => {
            // Save as draft functionality would go here
            console.log("Save as draft:", { subject, content, recipients: selectedRecipients });
          }}
        >
          <Copy className="mr-2 h-4 w-4" />
          Save as Draft
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          <Send className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Sending...' : isScheduled ? 'Schedule Message' : 'Send Message'}
        </Button>
      </div>

      {/* Merge Tags Dialog */}
      <MergeTagsDialog
        open={isMergeTagsDialogOpen}
        onOpenChange={setIsMergeTagsDialogOpen}
        onSelectTag={handleInsertMergeTag}
      />

      {/* Preview Dialog */}
      <Dialog open={showMergeTagPreview} onOpenChange={setShowMergeTagPreview}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Preview with Merge Tags</DialogTitle>
          </DialogHeader>
          <div className="border rounded-md p-4 max-h-[500px] overflow-auto">
            {format === 'html' ? (
              <div dangerouslySetInnerHTML={{ __html: previewContent }} />
            ) : (
              <div className="whitespace-pre-wrap">{previewContent}</div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowMergeTagPreview(false)}>Close Preview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
};

export default MessageComposer;
