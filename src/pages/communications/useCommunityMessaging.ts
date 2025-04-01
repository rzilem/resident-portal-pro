
import { useState } from 'react';
import { MessageTemplate } from './types';

type Tab = 'compose' | 'history' | 'templates';
type RecipientType = string;
type FormatOption = string;
type MessageType = string;

// Sample data for templates
export const INITIAL_TEMPLATES: MessageTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    description: 'Welcome message for new residents',
    subject: 'Welcome to Our Community!',
    content: 'Dear {{resident.name}},\n\nWelcome to {{association.name}}! We are delighted to have you as part of our community.',
    type: 'email',
    format: 'plain',
    lastUpdated: new Date().toISOString(),
    isDefault: true,
    tags: ['welcome', 'residents']
  },
  {
    id: '2',
    name: 'Payment Reminder',
    description: 'Reminder for upcoming payments',
    subject: 'Payment Reminder',
    content: 'Dear {{resident.name}},\n\nThis is a friendly reminder that your payment is due on the 1st of next month.',
    type: 'email',
    format: 'plain',
    lastUpdated: new Date().toISOString(),
    tags: ['payment', 'reminder']
  }
];

// Define the hook
export const useCommunityMessaging = (initialTab: Tab = 'compose') => {
  const [selectedTab, setSelectedTab] = useState<Tab>(initialTab);
  const [messageText, setMessageText] = useState('');
  const [subject, setSubject] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');

  // Sample data for recipient types
  const recipientTypes = [
    { id: 'all', label: 'All Residents' },
    { id: 'homeowners', label: 'Homeowners' },
    { id: 'tenants', label: 'Tenants' },
    { id: 'board', label: 'Board Members' }
  ];

  // Sample data for format options
  const formatOptions = [
    { id: 'plain', label: 'Plain Text' },
    { id: 'html', label: 'HTML' }
  ];

  // Sample data for message types
  const messageTypes = [
    { id: 'email', label: 'Email' },
    { id: 'sms', label: 'SMS' }
  ];

  // Handler functions
  const handleUpdateSelectedRecipientType = (type: RecipientType) => {
    console.log('Selected recipient type:', type);
  };

  const handleUpdateSelectedFormat = (format: FormatOption) => {
    console.log('Selected format:', format);
  };

  const handleUpdateSelectedMessageType = (type: MessageType) => {
    console.log('Selected message type:', type);
  };

  const handleSendMessage = () => {
    console.log('Sending message:', { subject, messageText });
    // Implementation would go here
  };

  const handleSaveAsDraft = () => {
    console.log('Saving as draft:', { subject, messageText });
    // Implementation would go here
  };

  const handleSchedule = () => {
    console.log('Scheduling message for:', scheduledDate);
    // Implementation would go here
  };

  const handleOpenAISuggestion = () => {
    console.log('Opening AI suggestion dialog');
    // Implementation would go here
  };

  return {
    selectedTab,
    setSelectedTab,
    recipientTypes,
    formatOptions,
    messageTypes,
    handleUpdateSelectedRecipientType,
    handleUpdateSelectedFormat,
    handleUpdateSelectedMessageType,
    handleSendMessage,
    handleSaveAsDraft,
    handleSchedule,
    handleOpenAISuggestion,
    messageText,
    setMessageText,
    subject,
    setSubject,
    scheduledDate,
    setScheduledDate
  };
};
