import React, { useState, useEffect } from 'react';
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
import TemplateSelector from './composer/TemplateSelector';

const SAMPLE_TEMPLATES = [
  {
    id: '1',
    name: 'Welcome New Resident',
    description: 'Send to new residents to welcome them to the community',
    subject: 'Welcome to our Community!',
    content: '<p>Dear {{resident.first_name}},</p><p>On behalf of the {{association.name}}, we would like to welcome you to our community! We are excited to have you join us.</p><p>Please find attached our welcome packet with important information about our community rules, amenities, and contact information.</p><p>If you have any questions, feel free to reach out to us at {{association.email}} or {{association.phone}}.</p><p>Best regards,<br>{{board.president}}<br>Board President</p>',
    category: 'Welcome',
    createdAt: '2023-07-15T10:00:00Z',
    updatedAt: '2023-07-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Monthly Meeting Reminder',
    description: 'Monthly reminder about upcoming board meeting',
    subject: 'Reminder: Monthly Board Meeting - {{meeting.date}}',
    content: '<p>Dear Homeowners,</p><p>This is a reminder that our monthly board meeting will be held on {{meeting.date}} at {{meeting.time}} in the {{meeting.location}}.</p><p>Agenda items include:</p><p>{{meeting.agenda}}</p><p>We hope to see you there!</p><p>Regards,<br>{{board.secretary}}<br>Board Secretary</p>',
    category: 'Meetings',
    createdAt: '2023-07-16T10:00:00Z',
    updatedAt: '2023-07-16T10:00:00Z'
  },
  {
    id: '3',
    name: 'Annual Assessment Notice',
    description: 'Annual notice about upcoming assessment dues',
    subject: 'Annual Assessment Notice for {{association.name}}',
    content: '<p>Dear {{resident.name}},</p><p>This letter serves as a notice that your annual assessment for your property at {{property.address}} is due on {{financial.due_date}}.</p><p>The annual assessment amount is {{financial.monthly_assessment}}.</p><p>Payment can be made via {{financial.payment_methods}}.</p><p>If you have any questions, please contact our office.</p><p>Thank you,<br>{{board.treasurer}}<br>Board Treasurer</p>',
    category: 'Financial',
    createdAt: '2023-07-17T10:00:00Z',
    updatedAt: '2023-07-17T10:00:00Z'
  }
];

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
  const [templates, setTemplates] = useState(SAMPLE_TEMPLATES);

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

  const handleTemplateSelect = (template: any) => {
    setSubject(template.subject);
    setContent(template.content);
    if (format === 'plain' && template.content.includes('<')) {
      setFormat('html');
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
            <div className="flex justify-between items-center">
              <Label htmlFor="subject">Subject</Label>
              <TemplateSelector 
                templates={templates}
                onSelectTemplate={handleTemplateSelect}
              />
            </div>
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
