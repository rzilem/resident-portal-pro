
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Send, Bot, Copy, TagIcon } from 'lucide-react';
import HtmlEditor from './HtmlEditor';
import { Textarea } from '@/components/ui/textarea';
import { mergeTagService } from '@/services/mergeTagService';
import MergeTagsDialog from './MergeTagsDialog';
import { MessageData } from './composer/types';
import RecipientSelector from './composer/RecipientSelector';
import FormatSelector from './composer/FormatSelector';
import ScheduleOptions from './composer/ScheduleOptions';
import MessagePreview from './composer/MessagePreview';
import AiAssistant from './composer/AiAssistant';

interface MessageComposerProps {
  onSendMessage: (message: { subject: string; content: string; recipients: string[] }) => void;
  initialSubject?: string;
  initialContent?: string;
}

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
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

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
      
      setSubject('');
      setContent('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInsertMergeTag = (tag: any) => {
    if (format === 'plain') {
      setContent(prev => prev + ' ' + tag.tag + ' ');
    } else {
      setContent(prev => prev + ' ' + tag.tag + ' ');
    }
  };

  const handlePreviewWithMergeTags = async () => {
    const processed = await mergeTagService.processMergeTags(content, {});
    setPreviewContent(processed);
    setShowMergeTagPreview(true);
  };

  const handleAiSuggestion = (aiResponse: string) => {
    if (format === 'plain') {
      setContent(prev => prev + (prev ? '\n\n' : '') + aiResponse);
    } else {
      const htmlContent = aiResponse.startsWith('<') 
        ? aiResponse 
        : `<p>${aiResponse.replace(/\n/g, '</p><p>')}</p>`;
      
      setContent(prev => prev + htmlContent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-6">
          <RecipientSelector 
            selectedRecipients={selectedRecipients}
            onRecipientsChange={setSelectedRecipients}
          />

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
                  onClick={() => setIsAiAssistantOpen(true)}
                  className="gap-1"
                >
                  <Bot className="h-4 w-4" />
                  AI Assist
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsMergeTagsDialogOpen(true)}
                >
                  <TagIcon className="mr-2 h-4 w-4" />
                  Insert Merge Tag
                </Button>
                <FormatSelector 
                  format={format}
                  onFormatChange={setFormat}
                />
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
          
          <ScheduleOptions 
            isScheduled={isScheduled}
            scheduledDate={scheduledDate}
            onScheduledChange={setIsScheduled}
            onDateChange={setScheduledDate}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => {
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

      <MergeTagsDialog
        open={isMergeTagsDialogOpen}
        onOpenChange={setIsMergeTagsDialogOpen}
        onSelectTag={handleInsertMergeTag}
      />

      <MessagePreview
        open={showMergeTagPreview}
        onOpenChange={setShowMergeTagPreview}
        content={previewContent}
        format={format}
      />

      <AiAssistant
        open={isAiAssistantOpen}
        onOpenChange={setIsAiAssistantOpen}
        onApplySuggestion={handleAiSuggestion}
      />
    </form>
  );
};

export default MessageComposer;
