
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mergeTagService } from '@/services/mergeTagService';

interface ComposerContextProps {
  subject: string;
  setSubject: (subject: string) => void;
  content: string;
  setContent: (content: string) => void;
  format: 'plain' | 'html';
  setFormat: (format: 'plain' | 'html') => void;
  messageType: 'email' | 'sms';
  setMessageType: (type: 'email' | 'sms') => void;
  community: string;
  setCommunity: (community: string) => void;
  recipients: string[];
  setRecipients: (recipients: string[]) => void;
  scheduledDate: Date | null;
  setScheduledDate: (date: Date | null) => void;
  showMergeTagPreview: boolean;
  setShowMergeTagPreview: (show: boolean) => void;
  previewContent: string;
  setPreviewContent: (content: string) => void;
  previewProcessedContent: (content: string) => Promise<string>;
  
  // Add missing properties that are referenced in other components
  selectedCommunity: string;
  setSelectedCommunity: (community: string) => void;
  selectedRecipients: string[];
  setSelectedRecipients: (recipients: string[]) => void;
  scheduledSend: boolean;
  setScheduledSend: (scheduled: boolean) => void;
  scheduledTime: string;
  setScheduledTime: (time: string) => void;
  isScheduled: boolean;
  setIsScheduled: (isScheduled: boolean) => void;
}

interface ComposerProviderProps {
  children: ReactNode;
  initialSubject?: string;
  initialContent?: string;
  initialCommunity?: string;
}

const ComposerContext = createContext<ComposerContextProps | undefined>(undefined);

export const ComposerProvider: React.FC<ComposerProviderProps> = ({
  children,
  initialSubject = '',
  initialContent = '',
  initialCommunity = '',
}) => {
  const [subject, setSubject] = useState(initialSubject);
  const [content, setContent] = useState(initialContent);
  const [format, setFormat] = useState<'plain' | 'html'>('html');
  const [messageType, setMessageType] = useState<'email' | 'sms'>('email');
  const [community, setCommunity] = useState(initialCommunity);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [showMergeTagPreview, setShowMergeTagPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');

  // Add state for the missing properties
  const [selectedCommunity, setSelectedCommunity] = useState(initialCommunity);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [scheduledSend, setScheduledSend] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);

  // Function to process merge tags for preview
  const previewProcessedContent = async (contentToProcess: string): Promise<string> => {
    try {
      const processed = await mergeTagService.processMergeTags(contentToProcess);
      return processed;
    } catch (error) {
      console.error('Error processing merge tags for preview:', error);
      return contentToProcess;
    }
  };

  return (
    <ComposerContext.Provider
      value={{
        subject,
        setSubject,
        content,
        setContent,
        format,
        setFormat,
        messageType,
        setMessageType,
        community,
        setCommunity,
        recipients,
        setRecipients,
        scheduledDate,
        setScheduledDate,
        showMergeTagPreview,
        setShowMergeTagPreview,
        previewContent,
        setPreviewContent,
        previewProcessedContent,
        
        // Add the missing properties
        selectedCommunity,
        setSelectedCommunity,
        selectedRecipients,
        setSelectedRecipients,
        scheduledSend,
        setScheduledSend,
        scheduledTime,
        setScheduledTime,
        isScheduled,
        setIsScheduled,
      }}
    >
      {children}
    </ComposerContext.Provider>
  );
};

export const useComposer = (): ComposerContextProps => {
  const context = useContext(ComposerContext);
  if (!context) {
    throw new Error('useComposer must be used within a ComposerProvider');
  }
  return context;
};
