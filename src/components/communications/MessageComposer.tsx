
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
import { INITIAL_TEMPLATES } from '@/pages/communications/useCommunityMessaging';

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
    showMergeTagPreview,
    setShowMergeTagPreview
  } = useComposer();
  
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isMergeTagsDialogOpen, setIsMergeTagsDialogOpen] = useState(false);

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

  console.log("ComposerContent rendering with showMergeTagPreview:", showMergeTagPreview);

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-6">
          <CommunitySelector />
          
          <RecipientSelector />
          
          <SubjectField templates={INITIAL_TEMPLATES} />
          
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
