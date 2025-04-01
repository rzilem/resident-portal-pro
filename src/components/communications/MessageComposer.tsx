
import React, { useState } from 'react';
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
import { appendToContent } from './composer/ComposerUtils';
import { useComposer } from './composer/ComposerContext';
import { MessageTemplate } from '@/components/communications/templates/types';
import { MergeTag } from '@/types/mergeTags';
import MessageTypeSelector from './composer/MessageTypeSelector';

export interface MessageComposerProps {
  onSendMessage: (message: { subject: string; content: string; recipients: string[] }) => void;
  onScheduleMessage?: (message: { subject: string; content: string; recipients: string[]; scheduledDate: Date }) => void;
  initialSubject?: string;
  initialContent?: string;
  availableTemplates?: MessageTemplate[];
}

// Main component wrapper
const MessageComposer: React.FC<MessageComposerProps> = ({ 
  onSendMessage,
  onScheduleMessage,
  initialSubject = '',
  initialContent = '',
  availableTemplates = [],
}) => {
  console.log("MessageComposer rendered with:", { initialSubject, initialContent });
  
  return (
    <ComposerProvider 
      initialSubject={initialSubject} 
      initialContent={initialContent}
      initialCommunity={SAMPLE_COMMUNITIES[0].id}
    >
      <ComposerContent 
        onSendMessage={onSendMessage} 
        onScheduleMessage={onScheduleMessage}
        availableTemplates={availableTemplates}
      />
    </ComposerProvider>
  );
};

// Inner component that uses the context
const ComposerContent: React.FC<{ 
  onSendMessage: MessageComposerProps['onSendMessage'];
  onScheduleMessage?: MessageComposerProps['onScheduleMessage'];
  availableTemplates?: MessageTemplate[];
}> = ({ 
  onSendMessage, 
  onScheduleMessage,
  availableTemplates = []
}) => {
  const { 
    previewContent, 
    content, 
    format, 
    setContent,
    showMergeTagPreview,
    setShowMergeTagPreview,
    messageType
  } = useComposer();
  
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isMergeTagsDialogOpen, setIsMergeTagsDialogOpen] = useState(false);

  const handleInsertMergeTag = (tag: MergeTag) => {
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

  console.log("ComposerContent rendering with showMergeTagPreview:", showMergeTagPreview);

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-6">
          <CommunitySelector />
          
          <MessageTypeSelector />
          
          <RecipientSelector />
          
          {/* Only show subject field for emails */}
          {messageType === 'email' && (
            <SubjectField templates={availableTemplates || []} />
          )}
          
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
