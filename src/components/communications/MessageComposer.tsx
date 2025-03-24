
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Users, Copy } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import HtmlEditor from './HtmlEditor';

interface MessageComposerProps {
  onSendMessage: (message: { subject: string; content: string; recipients: string[] }) => void;
  initialSubject?: string;
  initialContent?: string;
}

const RecipientGroups = [
  { id: 'all', name: 'All Residents' },
  { id: 'property-owners', name: 'Property Owners' },
  { id: 'tenants', name: 'Tenants' },
  { id: 'board-members', name: 'Board Members' },
  { id: 'committee-members', name: 'Committee Members' },
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
                <PopoverContent className="w-64 p-4">
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Select recipient groups</h4>
                    <div className="space-y-2">
                      {RecipientGroups.map(group => (
                        <div key={group.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`group-${group.id}`} 
                            checked={selectedRecipients.includes(group.id)} 
                            onCheckedChange={() => toggleRecipientGroup(group.id)}
                          />
                          <Label htmlFor={`group-${group.id}`}>{group.name}</Label>
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
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => {
            // Save as draft functionality would go here
            console.log("Save as draft:", { subject, content });
          }}
        >
          <Copy className="mr-2 h-4 w-4" />
          Save as Draft
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          <Send className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </div>
    </form>
  );
};

export default MessageComposer;
