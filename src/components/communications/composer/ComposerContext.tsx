
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MessageData } from './types';

interface ComposerContextType {
  subject: string;
  setSubject: (subject: string) => void;
  content: string;
  setContent: (content: string) => void;
  format: 'plain' | 'html';
  setFormat: (format: 'plain' | 'html') => void;
  selectedRecipients: string[];
  setSelectedRecipients: (recipients: string[]) => void;
  scheduledDate: string;
  setScheduledDate: (date: string) => void;
  isScheduled: boolean;
  setIsScheduled: (isScheduled: boolean) => void;
  selectedCommunity: string;
  setSelectedCommunity: (community: string) => void;
  previewContent: string;
  setPreviewContent: (content: string) => void;
}

const ComposerContext = createContext<ComposerContextType | undefined>(undefined);

export const useComposer = () => {
  const context = useContext(ComposerContext);
  if (!context) {
    throw new Error('useComposer must be used within a ComposerProvider');
  }
  return context;
};

interface ComposerProviderProps {
  children: React.ReactNode;
  initialSubject?: string;
  initialContent?: string;
  initialCommunity?: string;
}

export const ComposerProvider: React.FC<ComposerProviderProps> = ({
  children,
  initialSubject = '',
  initialContent = '',
  initialCommunity = '',
}) => {
  console.log("ComposerProvider initializing with:", { initialSubject, initialContent });
  
  const [subject, setSubject] = useState(initialSubject);
  const [content, setContent] = useState(initialContent);
  const [format, setFormat] = useState<'plain' | 'html'>('html');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>(['all']);
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<string>(initialCommunity);
  const [previewContent, setPreviewContent] = useState('');

  // Effect to update state when initialSubject or initialContent change
  useEffect(() => {
    console.log("initialSubject changed:", initialSubject);
    setSubject(initialSubject);
  }, [initialSubject]);

  useEffect(() => {
    console.log("initialContent changed:", initialContent);
    setContent(initialContent);
  }, [initialContent]);

  const value = {
    subject,
    setSubject,
    content,
    setContent,
    format,
    setFormat,
    selectedRecipients,
    setSelectedRecipients,
    scheduledDate,
    setScheduledDate,
    isScheduled,
    setIsScheduled,
    selectedCommunity,
    setSelectedCommunity,
    previewContent,
    setPreviewContent,
  };

  return (
    <ComposerContext.Provider value={value}>
      {children}
    </ComposerContext.Provider>
  );
};
