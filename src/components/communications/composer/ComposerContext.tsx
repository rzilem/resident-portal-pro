
import React, { createContext, useContext, useState, ReactNode } from 'react';

type MessageFormat = 'plain' | 'html';

interface ComposerContextType {
  subject: string;
  setSubject: (subject: string) => void;
  content: string;
  setContent: (content: string) => void;
  previewContent: string;
  setPreviewContent: (content: string) => void;
  format: MessageFormat;
  setFormat: (format: MessageFormat) => void;
  selectedCommunity: string;
  setSelectedCommunity: (communityId: string) => void;
  selectedRecipients: string[];
  setSelectedRecipients: (recipients: string[]) => void;
  scheduleLater: boolean;
  setScheduleLater: (schedule: boolean) => void;
  scheduledDate: Date | null;
  setScheduledDate: (date: Date | null) => void;
  showMergeTagPreview: boolean;
  setShowMergeTagPreview: (show: boolean) => void;
  isScheduled: boolean;
  setIsScheduled: (isScheduled: boolean) => void;
  // Add the missing properties for ScheduleOptions component
  scheduledSend: boolean;
  setScheduledSend: (scheduled: boolean) => void;
  scheduledTime: string;
  setScheduledTime: (time: string) => void;
}

// Create the context with a default value
const ComposerContext = createContext<ComposerContextType | undefined>(undefined);

// Props for the provider component
interface ComposerProviderProps {
  children: ReactNode;
  initialSubject?: string;
  initialContent?: string;
  initialCommunity?: string;
}

// Provider component that wraps the components that need access to the context
export const ComposerProvider: React.FC<ComposerProviderProps> = ({
  children,
  initialSubject = '',
  initialContent = '',
  initialCommunity = '',
}) => {
  const [subject, setSubject] = useState(initialSubject);
  const [content, setContent] = useState(initialContent);
  const [previewContent, setPreviewContent] = useState('');
  const [format, setFormat] = useState<MessageFormat>('html');
  const [selectedCommunity, setSelectedCommunity] = useState(initialCommunity);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [scheduleLater, setScheduleLater] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [showMergeTagPreview, setShowMergeTagPreview] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  // Add state for the missing properties
  const [scheduledSend, setScheduledSend] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');

  // The value that will be provided to consumers of the context
  const value = {
    subject,
    setSubject,
    content,
    setContent,
    previewContent,
    setPreviewContent,
    format,
    setFormat,
    selectedCommunity,
    setSelectedCommunity,
    selectedRecipients,
    setSelectedRecipients,
    scheduleLater,
    setScheduleLater,
    scheduledDate,
    setScheduledDate,
    showMergeTagPreview,
    setShowMergeTagPreview,
    isScheduled,
    setIsScheduled,
    // Add the missing properties to the context value
    scheduledSend,
    setScheduledSend,
    scheduledTime,
    setScheduledTime,
  };

  return (
    <ComposerContext.Provider value={value}>
      {children}
    </ComposerContext.Provider>
  );
};

// Custom hook to use the composer context
export const useComposer = () => {
  const context = useContext(ComposerContext);
  if (context === undefined) {
    throw new Error('useComposer must be used within a ComposerProvider');
  }
  return context;
};
