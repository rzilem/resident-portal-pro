
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ComposerContextType {
  subject: string;
  setSubject: (subject: string) => void;
  content: string;
  setContent: (content: string) => void;
  format: 'plain' | 'html';
  setFormat: (format: 'plain' | 'html') => void;
  previewContent: string;
  setPreviewContent: (content: string) => void;
  selectedRecipients: string[];
  setSelectedRecipients: (recipients: string[]) => void;
  selectedCommunity: string;
  setSelectedCommunity: (community: string) => void;
  scheduledSend: boolean;
  setScheduledSend: (scheduled: boolean) => void;
  scheduledDate: Date | null;
  setScheduledDate: (date: Date | null) => void;
  scheduledTime: string;
  setScheduledTime: (time: string) => void;
  showMergeTagPreview: boolean;
  setShowMergeTagPreview: (show: boolean) => void;
  isScheduled: boolean;
  setIsScheduled: (scheduled: boolean) => void;
  messageType: 'email' | 'sms';
  setMessageType: (type: 'email' | 'sms') => void;
  previewProcessedContent: (content: string) => Promise<string>;
  // Add missing properties
  recipientType: string;
  validateCanSend: () => { valid: boolean; error?: string };
}

const ComposerContext = createContext<ComposerContextType | undefined>(undefined);

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
  const [subject, setSubject] = useState(initialSubject);
  const [content, setContent] = useState(initialContent);
  const [format, setFormat] = useState<'plain' | 'html'>(
    initialContent?.includes('<') ? 'html' : 'plain'
  );
  const [previewContent, setPreviewContent] = useState(initialContent);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState(initialCommunity);
  const [scheduledSend, setScheduledSend] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [scheduledTime, setScheduledTime] = useState('12:00');
  const [showMergeTagPreview, setShowMergeTagPreview] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [messageType, setMessageType] = useState<'email' | 'sms'>('email');
  const [recipientType, setRecipientType] = useState('all');

  useEffect(() => {
    // For the prototype, we'll just do a simple merge tag replacement
    // In a real app, this would be more sophisticated
    let processedContent = content;
    processedContent = processedContent.replace(/{{resident\.first_name}}/g, 'John');
    processedContent = processedContent.replace(/{{resident\.name}}/g, 'John Smith');
    processedContent = processedContent.replace(/{{association\.name}}/g, 'Sunset Heights HOA');
    processedContent = processedContent.replace(/{{association\.email}}/g, 'info@sunsetheights.org');
    processedContent = processedContent.replace(/{{association\.phone}}/g, '555-123-4567');
    processedContent = processedContent.replace(/{{board\.president}}/g, 'Sarah Johnson');
    processedContent = processedContent.replace(/{{property\.address}}/g, '123 Main St');

    setPreviewContent(processedContent);
  }, [content]);

  // Add a function to process content for preview
  const previewProcessedContent = async (contentToProcess: string): Promise<string> => {
    // For the prototype, we'll just do a simple merge tag replacement
    let processedContent = contentToProcess;
    processedContent = processedContent.replace(/{{resident\.first_name}}/g, 'John');
    processedContent = processedContent.replace(/{{resident\.name}}/g, 'John Smith');
    processedContent = processedContent.replace(/{{association\.name}}/g, 'Sunset Heights HOA');
    processedContent = processedContent.replace(/{{association\.email}}/g, 'info@sunsetheights.org');
    processedContent = processedContent.replace(/{{association\.phone}}/g, '555-123-4567');
    processedContent = processedContent.replace(/{{board\.president}}/g, 'Sarah Johnson');
    processedContent = processedContent.replace(/{{property\.address}}/g, '123 Main St');
    
    return processedContent;
  };

  const validateCanSend = () => {
    if (!content.trim()) {
      return { valid: false, error: 'Message content is required' };
    }
    
    if (messageType === 'email' && !subject.trim()) {
      return { valid: false, error: 'Subject is required for email messages' };
    }
    
    if (selectedRecipients.length === 0 && recipientType === 'custom') {
      return { valid: false, error: 'Please select at least one recipient' };
    }
    
    return { valid: true };
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
        previewContent,
        setPreviewContent,
        selectedRecipients,
        setSelectedRecipients,
        selectedCommunity,
        setSelectedCommunity,
        scheduledSend,
        setScheduledSend,
        scheduledDate,
        setScheduledDate,
        scheduledTime,
        setScheduledTime,
        showMergeTagPreview,
        setShowMergeTagPreview,
        isScheduled,
        setIsScheduled,
        messageType,
        setMessageType,
        previewProcessedContent,
        recipientType,
        validateCanSend,
      }}
    >
      {children}
    </ComposerContext.Provider>
  );
};

export const useComposer = (): ComposerContextType => {
  const context = useContext(ComposerContext);
  if (context === undefined) {
    throw new Error('useComposer must be used within a ComposerProvider');
  }
  return context;
};
