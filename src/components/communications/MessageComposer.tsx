
import React from 'react';
import { ComposerProvider } from './composer/ComposerContext';
import CommunitySelector, { SAMPLE_COMMUNITIES } from './composer/CommunitySelector';
import RecipientSelector from './composer/RecipientSelector';
import SubjectField from './composer/SubjectField';
import ContentEditor from './composer/ContentEditor';
import ScheduleOptions from './composer/ScheduleOptions';
import ComposerActions from './composer/ComposerActions';
import MergeTagsDialog from './MergeTagsDialog';
import MessagePreview from './composer/MessagePreview';
import AiAssistant from './composer/AiAssistant';
import { useDialogState, appendToContent } from './composer/ComposerUtils';
import { useComposer } from './composer/ComposerContext';

// Sample template data
const SAMPLE_TEMPLATES = [
  {
    id: '1',
    name: 'Welcome New Resident',
    description: 'Send to new residents to welcome them to the community',
    subject: 'Welcome to our Community!',
    content: '<p>Dear {{resident.first_name}},</p><p>On behalf of the {{association.name}}, we would like to welcome you to our community! We are excited to have you join us.</p><p>Please find attached our welcome packet with important information about our community rules, amenities, and contact information.</p><p>If you have any questions, feel free to reach out to us at {{association.email}} or {{association.phone}}.</p><p>Best regards,<br>{{board.president}}<br>Board President</p>',
    category: 'Welcome',
    communities: ['all'],
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
    communities: ['comm1', 'comm3'],
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
    communities: ['comm2', 'comm4'],
    createdAt: '2023-07-17T10:00:00Z',
    updatedAt: '2023-07-17T10:00:00Z'
  }
];

interface MessageComposerProps {
  onSendMessage: (message: { subject: string; content: string; recipients: string[] }) => void;
  initialSubject?: string;
  initialContent?: string;
}

// Main component wrapper
const MessageComposer: React.FC<MessageComposerProps> = ({ 
  onSendMessage,
  initialSubject = '',
  initialContent = '',
}) => {
  console.log("MessageComposer rendered with:", { initialSubject, initialContent });
  
  return (
    <ComposerProvider 
      initialSubject={initialSubject} 
      initialContent={initialContent}
      initialCommunity={SAMPLE_COMMUNITIES[0].id}
    >
      <ComposerContent onSendMessage={onSendMessage} />
    </ComposerProvider>
  );
};

// Inner component that uses the context
const ComposerContent: React.FC<{ onSendMessage: MessageComposerProps['onSendMessage'] }> = ({ onSendMessage }) => {
  const { 
    previewContent, 
    content, 
    format, 
    setContent,
    selectedCommunity
  } = useComposer();
  
  const {
    isAiAssistantOpen,
    setIsAiAssistantOpen,
    isMergeTagsDialogOpen,
    setIsMergeTagsDialogOpen,
    showMergeTagPreview,
    setShowMergeTagPreview
  } = useDialogState();

  const handleInsertMergeTag = (tag: any) => {
    // Use the appendToContent utility function instead of a function passed to setContent
    setContent(appendToContent(content, ' ' + tag.tag + ' '));
    setIsMergeTagsDialogOpen(false);
  };

  const handleAiSuggestion = (aiResponse: string) => {
    let newContent = content;
    
    if (format === 'plain') {
      newContent = content + (content ? '\n\n' : '') + aiResponse;
    } else {
      const htmlContent = aiResponse.startsWith('<') 
        ? aiResponse 
        : `<p>${aiResponse.replace(/\n/g, '</p><p>')}</p>`;
      
      newContent = content + htmlContent;
    }
    
    setContent(newContent);
  };

  return (
    <form className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-6">
          <CommunitySelector />
          
          <RecipientSelector />
          
          <SubjectField templates={SAMPLE_TEMPLATES} />
          
          <ContentEditor 
            onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
            onOpenMergeTagsDialog={() => setIsMergeTagsDialogOpen(true)}
          />
          
          <ScheduleOptions />
        </div>
      </div>

      <ComposerActions onSendMessage={onSendMessage} />

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
